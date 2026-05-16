import { USERS, BOOKS, LOANS } from './data';

const users = USERS.map((u) => ({ ...u }));
const books = BOOKS.map((b) => ({
  ...b,
  license: { ...b.license },
}));
const loans = LOANS.map((l) => ({ ...l }));

let nextLoanId = loans.length + 1;
let nextBookId = books.length + 1;

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

function makeToken(user) {
  return btoa(
    JSON.stringify({
      id: user.id,
      role: user.role,
      exp: Date.now() + 3600_000,
    }),
  );
}

function publicUser(u) {
  const { password, ...rest } = u;
  return rest;
}

// ─── authService ─────────────────────────────────────────────────────────────

export const authService = {
  login: async (email, password) => {
    await delay();
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );
    if (!user)
      throw {
        response: { data: { message: 'Email o contraseña incorrectos' } },
      };
    return { user: publicUser(user), token: makeToken(user) };
  },

  register: async (data) => {
    await delay();
    if (users.find((u) => u.email === data.email)) {
      throw { response: { data: { message: 'El email ya está registrado' } } };
    }
    const newUser = {
      id: `u${users.length + 1}`,
      role: 'STUDENT',
      hasSanction: false,
      sanctionEndDate: null,
      activeLoans: 0,
      ...data,
    };
    users.push(newUser);
    return { message: 'Registro exitoso' };
  },

  me: async () => {
    await delay();
    return publicUser(users[1]);
  },
};

// ─── bookService ──────────────────────────────────────────────────────────────

export const bookService = {
  getAll: async () => {
    await delay();
    return books.map((b) => ({ ...b, license: { ...b.license } }));
  },

  getById: async (id) => {
    await delay();
    const book = books.find((b) => b.id === id);
    if (!book) throw { response: { data: { message: 'Libro no encontrado' } } };
    return { ...book, license: { ...book.license } };
  },

  create: async (data) => {
    await delay();
    const newBook = {
      id: `b${nextBookId++}`,
      coverImageUrl: null,
      active: true,
      ...data,
      license: {
        maxConcurrentLoans: data.license?.maxConcurrentLoans ?? 1,
        activeLoanCount: 0,
      },
    };
    books.push(newBook);
    return { ...newBook, license: { ...newBook.license } };
  },

  update: async (id, data) => {
    await delay();
    const idx = books.findIndex((b) => b.id === id);
    if (idx === -1)
      throw { response: { data: { message: 'Libro no encontrado' } } };
    const newMax =
      data.license?.maxConcurrentLoans ?? books[idx].license.maxConcurrentLoans;
    books[idx] = {
      ...books[idx],
      ...data,
      license: {
        maxConcurrentLoans: newMax,
        activeLoanCount: Math.min(books[idx].license.activeLoanCount, newMax),
      },
    };
    return { ...books[idx], license: { ...books[idx].license } };
  },

  remove: async (id) => {
    await delay();
    const idx = books.findIndex((b) => b.id === id);
    if (idx === -1)
      throw { response: { data: { message: 'Libro no encontrado' } } };
    books.splice(idx, 1);
    return { message: 'Libro eliminado' };
  },
};

// ─── loanService ──────────────────────────────────────────────────────────────

export const loanService = {
  borrow: async (bookId, userId = 'u2') => {
    await delay();
    const user = users.find((u) => String(u.id) === String(userId));
    if (!user)
      throw { response: { data: { message: 'Estudiante no encontrado' } } };
    if (user.hasSanction)
      throw { response: { data: { message: 'Cuenta sancionada' } } };
    const activeLoans = loans.filter(
      (l) => l.studentId === String(userId) && l.active,
    ).length;
    if (user.gpa < 3.2 && activeLoans >= 1)
      throw {
        response: {
          data: { message: 'Promedio bajo: maximo 1 prestamo activo' },
        },
      };
    const book = books.find((b) => b.id === bookId);
    if (!book) throw { response: { data: { message: 'Libro no encontrado' } } };
    if (book.license.activeLoanCount >= book.license.maxConcurrentLoans)
      throw { response: { data: { message: 'No hay licencias disponibles' } } };

    const loan = {
      id: `l${nextLoanId++}`,
      bookId,
      bookTitle: book.title,
      studentId: userId,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      active: true,
      hasUsed: false,
    };
    loans.push(loan);
    book.license.activeLoanCount += 1;
    return { ...loan };
  },

  myLoans: async (params = {}, userId = 'u2') => {
    await delay();
    const activeParam = params.active;
    return loans
      .filter((l) => l.studentId === userId)
      .filter((l) =>
        activeParam === undefined ? true : l.active === activeParam,
      )
      .map((l) => ({ ...l }));
  },

  returnBook: async (loanId) => {
    await delay();
    const loan = loans.find((l) => l.id === loanId);
    if (!loan)
      throw { response: { data: { message: 'Préstamo no encontrado' } } };
    loan.active = false;
    loan.endDate = new Date().toISOString();
    const book = books.find((b) => b.id === loan.bookId);
    if (book)
      book.license.activeLoanCount = Math.max(
        0,
        book.license.activeLoanCount - 1,
      );
    return { message: 'Libro devuelto' };
  },

  pingActivity: async (loanId) => {
    await delay(50);
    const loan = loans.find((l) => l.id === loanId && l.active);
    if (!loan) return {};
    loan.hasUsed = true;
    return {};
  },

  getById: async (loanId) => {
    await delay();
    const loan = loans.find((l) => l.id === loanId);
    if (!loan)
      throw { response: { data: { message: 'Préstamo no encontrado' } } };
    const book = books.find((b) => b.id === loan.bookId);
    if (!book) throw { response: { data: { message: 'Libro no encontrado' } } };
    return {
      ...loan,
      pdfUrl: book.pdfUrl,
      author: book.author,
      synopsis: book.synopsis,
    };
  },

  getStudentLoans: async (studentId, { page = 0, size = 10 } = {}) => {
    await delay();
    const all = loans
      .filter((l) => l.studentId === String(studentId))
      .map((l) => ({ ...l }));
    const start = page * size;
    const content = all.slice(start, start + size);
    return {
      content,
      totalElements: all.length,
      totalPages: Math.max(1, Math.ceil(all.length / size)),
      number: page,
      size,
    };
  },
};

// ─── studentService ───────────────────────────────────────────────────────────

export const studentService = {
  getAll: async ({ university, page = 0, size = 10 } = {}) => {
    await delay();
    const all = users
      .filter(
        (u) =>
          u.role === 'STUDENT' && (!university || u.university === university),
      )
      .map(publicUser);
    const start = page * size;
    const content = all.slice(start, start + size);
    return {
      content,
      totalElements: all.length,
      totalPages: Math.max(1, Math.ceil(all.length / size)),
      number: page,
      size,
    };
  },

  getById: async (id) => {
    await delay();
    const user = users.find((u) => String(u.id) === String(id));
    if (!user)
      throw { response: { data: { message: 'Estudiante no encontrado' } } };
    return publicUser(user);
  },

  updateSanction: async (id, active, sanctionEndDate = null) => {
    await delay();
    const user = users.find((u) => String(u.id) === String(id));
    if (!user)
      throw { response: { data: { message: 'Estudiante no encontrado' } } };
    user.hasSanction = active;
    user.sanctionEndDate = active ? sanctionEndDate : null;
    return publicUser(user);
  },

  create: async (data) => {
    await delay();
    if (users.find((u) => u.email === data.email))
      throw { response: { data: { message: 'El email ya está registrado' } } };
    const newUser = {
      id: `u${users.length + 1}`,
      role: 'STUDENT',
      hasSanction: false,
      sanctionEndDate: null,
      gpa: 3.5,
      activeLoans: 0,
      ...data,
    };
    users.push(newUser);
    return publicUser(newUser);
  },
};
