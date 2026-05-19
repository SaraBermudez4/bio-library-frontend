import api from './api';

function normalizeBook(b) {
  const [firstName, ...rest] = (b.author ?? '').trim().split(' ');
  return {
    id: b.id,
    isbn: b.isbn,
    title: b.title,
    author: { name: firstName ?? '', lastName: rest.join(' ') },
    category: b.category ?? null,
    synopsis: b.description ?? '',
    pdfUrl: b.pdfUrl ?? null,
    coverImageUrl: b.imagenUrl ?? null,
    license: {
      maxConcurrentLoans: b.totalLicenses ?? 0,
      activeLoanCount: (b.totalLicenses ?? 0) - (b.availableLicenses ?? 0),
    },
  };
}

function toBookRequest(data) {
  return {
    isbn: data.isbn,
    title: data.title,
    author: data.author,
    category: data.category,
    description: data.synopsis,
    pdfUrl: data.pdfUrl,
    imagenUrl: data.coverImageUrl || null,
    totalLicenses: data.maxConcurrentLoans,
  };
}

async function fetchBookMap(bookIds) {
  const unique = [...new Set(bookIds.filter(Boolean))];
  const books = await Promise.all(
    unique.map((id) =>
      api
        .get(`/v1/books/${id}`)
        .then((r) => normalizeBook(r.data))
        .catch(() => null),
    ),
  );
  return Object.fromEntries(unique.map((id, i) => [id, books[i]]));
}

export const authService = {
  login: async (email, password) => {
    const { data: loginData } = await api.post('/v1/auth/login', {
      email,
      password,
    });
    const meRes = await api.get('/v1/auth/me', {
      headers: { Authorization: `Bearer ${loginData.accessToken}` },
    });
    return { user: meRes.data, token: loginData.accessToken };
  },
  me: () => api.get('/v1/auth/me').then((r) => r.data),
  register: (data) => api.post('/v1/students/create', data).then((r) => r.data),
};

export const bookService = {
  getAll: (params = {}) =>
    api
      .get('/v1/books', { params: { page: 0, size: 100, ...params } })
      .then((r) => ({
        content: (r.data.content ?? []).map(normalizeBook),
        totalPages: r.data.totalPages ?? 1,
        totalElements: r.data.totalElements ?? 0,
        page: r.data.page ?? 0,
      })),
  getById: (id) => api.get(`/v1/books/${id}`).then((r) => normalizeBook(r.data)),
  create: (data) => api.post('/v1/books', toBookRequest(data)).then((r) => normalizeBook(r.data)),
  update: (id, data) => api.put(`/v1/books/${id}`, toBookRequest(data)).then((r) => normalizeBook(r.data)),
  remove: (id) => api.delete(`/v1/books/${id}`).then((r) => r.data),
};

export const loanService = {
  borrow: (bookId) => api.post('/v1/loans', { bookId }).then((r) => r.data),

  myLoans: async (params = {}) => {
    const { data } = await api.get('/v1/loans/my-loans', { params });
    const loans = data.content ?? [];
    const bookMap = await fetchBookMap(loans.map((l) => l.bookId));
    return loans.map((l) => ({
      ...l,
      bookTitle: bookMap[l.bookId]?.title ?? `Libro #${l.bookId}`,
      pdfUrl: bookMap[l.bookId]?.pdfUrl ?? null,
    }));
  },

  returnBook: (loanId) =>
    api.patch(`/v1/loans/${loanId}/return`).then((r) => r.data),

  pingActivity: (loanId) =>
    api.patch(`/v1/loans/${loanId}/mark-used`).then((r) => r.data),

  getById: async (loanId) => {
    const { data } = await api.get('/v1/loans/my-loans', {
      params: { size: 50 },
    });
    const loan = (data.content ?? []).find(
      (l) => String(l.id) === String(loanId),
    );
    if (!loan)
      throw { response: { data: { message: 'Préstamo no encontrado' } } };
    const bookMap = await fetchBookMap([loan.bookId]);
    const book = bookMap[loan.bookId];
    return {
      ...loan,
      bookTitle: book?.title ?? `Libro #${loan.bookId}`,
      pdfUrl: book?.pdfUrl ?? null,
    };
  },

  getStudentLoans: async (studentId, params = {}) => {
    const { data } = await api.get(`/v1/loans/student/${studentId}`, {
      params,
    });
    const loans = data.content ?? [];
    const bookMap = await fetchBookMap(loans.map((l) => l.bookId));
    return {
      ...data,
      content: loans.map((l) => ({
        ...l,
        bookTitle: bookMap[l.bookId]?.title ?? `Libro #${l.bookId}`,
      })),
    };
  },
};

export const studentService = {
  getAll: (params) => api.get('/v1/students', { params }).then((r) => r.data),
  getById: (id) => api.get(`/v1/students/${id}`).then((r) => r.data),
  updateSanction: (id, active, sanctionEndDate = null) =>
    api
      .patch(`/v1/students/${id}/sanction`, { active, sanctionEndDate })
      .then((r) => r.data),
  create: (data) => api.post('/v1/students/create', data).then((r) => r.data),
};
