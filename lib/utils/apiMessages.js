const FALLBACK_ERROR = 'Ocurrió un error inesperado. Intenta nuevamente.';

// Each entry: [regex, (fullMatch, ...groups) => spanishString]
const TRANSLATIONS = [
  [
    /Student with email (.+?) already exists\./i,
    (_, x) => `El estudiante con correo ${x} ya existe.`,
  ],
  [
    /Student with DNI (.+?) already exists\./i,
    (_, x) => `El estudiante con DNI ${x} ya existe.`,
  ],
  [
    /Student with id (.+?) was not found\./i,
    (_, x) => `El estudiante con id ${x} no fue encontrado.`,
  ],
  [
    /Email must belong to the university domain: @(.+)/i,
    (_, x) => `El correo debe pertenecer al dominio de la universidad: @${x}`,
  ],
  [
    /Student with carnet (.+?) was not found in the university system\./i,
    (_, x) => `El estudiante con carnet ${x} no fue encontrado en el sistema universitario.`,
  ],
  [
    /The provided DNI does not match the one registered at the university\./i,
    () => 'El DNI ingresado no coincide con el registrado en la universidad.',
  ],
  [
    /The provided email does not match the one registered at the university\./i,
    () => 'El correo ingresado no coincide con el registrado en la universidad.',
  ],
  [
    /The student is not currently enrolled and cannot register\./i,
    () => 'El estudiante no se encuentra matriculado actualmente y no puede registrarse.',
  ],
  [
    /Book with id (.+?) was not found\./i,
    (_, x) => `El libro con id ${x} no fue encontrado.`,
  ],
  [
    /A book with isbn '(.+?)' already exists\./i,
    (_, x) => `Ya existe un libro registrado con el ISBN ${x}.`,
  ],
  [
    /Book has no available licenses \(total: (\d+)\)\./i,
    (_, x) => `El libro no tiene licencias disponibles. Total de licencias: ${x}.`,
  ],
  [
    /Loan with id (\d+) was not found\./i,
    (_, x) => `El préstamo con id ${x} no fue encontrado.`,
  ],
  [
    /Book with id (.+?) was not found in the catalog\./i,
    (_, x) => `El libro con id ${x} no fue encontrado en el catálogo.`,
  ],
  [
    /Book with id (.+?) has no available copies for loan\./i,
    (_, x) => `El libro con id ${x} no tiene copias disponibles para préstamo.`,
  ],
  [
    /Loan blocked: students with GPA below 3\.2 cannot have more than 1 active loan\./i,
    () => 'Préstamo bloqueado: los estudiantes con GPA inferior a 3.2 no pueden tener más de 1 préstamo activo.',
  ],
  [
    /Loan with id (\d+) is already returned\./i,
    (_, x) => `El préstamo con id ${x} ya fue devuelto.`,
  ],
  [
    /You are not authorized to return this loan\./i,
    () => 'No estás autorizado para devolver este préstamo.',
  ],
  [
    /Loan blocked: student has an active sanction\./i,
    () => 'Préstamo bloqueado: el estudiante tiene una sanción activa.',
  ],
];

/**
 * Intenta traducir un mensaje del backend (en inglés) a español.
 * Devuelve null si el mensaje no está en la tabla de traducciones.
 * Agregar nuevas traducciones: añadir una entrada al array TRANSLATIONS arriba.
 */
export function translateBackendError(message) {
  if (!message || typeof message !== 'string') return null;
  for (const [pattern, build] of TRANSLATIONS) {
    const match = message.match(pattern);
    if (match) return build(...match);
  }
  return null;
}

function rawFromAxiosError(err) {
  const d = err?.response?.data;
  if (!d) return err?.message ?? null;
  if (typeof d === 'string' && d.length) return d;
  if (d.message) return d.message;
  if (d.error && typeof d.error === 'string') return d.error;
  if (d.detail) return d.detail;
  if (Array.isArray(d.errors) && d.errors.length)
    return d.errors.map((e) => e.defaultMessage ?? e.message ?? e).join('. ');
  return err?.message ?? null;
}

// Heuristic: contains Spanish diacritics or common Spanish function words.
function looksSpanish(text) {
  if (/[áéíóúüñ¿¡]/i.test(text)) return true;
  return /\b(el|la|los|las|no|con|de|en|un|una|del|que|por|para|fue|ya|tu|su)\b/i.test(text);
}

/**
 * Convierte cualquier error de axios en un mensaje legible en español.
 * Orden de resolución:
 *  1. Traducción regex del mensaje del backend.
 *  2. Mensaje del backend si ya está en español.
 *  3. Fallback por código HTTP.
 *  4. Fallback genérico.
 */
export function getApiErrorMessage(error) {
  if (!error?.response) {
    if (error?.message?.toLowerCase().includes('network'))
      return 'No se pudo conectar con el servidor. Verifica tu conexión.';
    return FALLBACK_ERROR;
  }

  const raw = rawFromAxiosError(error);
  if (raw) {
    const translated = translateBackendError(raw);
    if (translated) return translated;
    if (looksSpanish(raw)) return raw;
  }

  const status = error.response.status;
  if (status === 401) return 'Tu sesión ha expirado. Inicia sesión nuevamente.';
  if (status === 403) return 'No tienes permiso para realizar esta acción.';
  if (status === 404) return 'El recurso solicitado no fue encontrado.';
  if (status === 409) return 'La operación generó un conflicto. Verifica los datos ingresados.';
  if (status === 422) return 'Los datos ingresados no son válidos.';
  if (status >= 500) return 'Error en el servidor. Intenta más tarde.';

  return FALLBACK_ERROR;
}

// ─── Mensajes de éxito ────────────────────────────────────────────────────────
// Para agregar un nuevo mensaje: añadir una clave aquí y usar getSuccessMessage('clave').
// Las plantillas aceptan variables con sintaxis {{nombre}}.
const SUCCESS_MESSAGES = {
  'book.create.success': 'Libro creado correctamente.',
  'book.update.success': 'Libro actualizado correctamente.',
  'book.delete.success': 'Libro eliminado correctamente.',
  'book.delete.alreadyDeleted': 'El libro ya no existía en el catálogo.',
  'loan.create.success': 'Préstamo creado correctamente.',
  'loan.return.success': '"{{title}}" devuelto exitosamente.',
  'student.create.success': 'Estudiante registrado correctamente.',
  'student.sanction.apply.success': 'Estudiante sancionado correctamente.',
  'student.sanction.remove.success': 'Sanción levantada correctamente.',
};

/**
 * Devuelve el mensaje de éxito para la clave dada.
 * Acepta variables opcionales para plantillas: getSuccessMessage('loan.return.success', { title: 'El libro' })
 */
export function getSuccessMessage(key, vars = {}) {
  const template = SUCCESS_MESSAGES[key] ?? key;
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? '');
}

// ─── Mensajes de error por dominio ───────────────────────────────────────────
// Mensajes específicos por contexto de negocio (complementan getApiErrorMessage).
// Agregar nuevas claves aquí cuando un endpoint necesite mensajes distintos al fallback HTTP.
const ERROR_MESSAGES = {
  'loan.borrow.conflict': 'No hay licencias disponibles o ya tienes este libro en préstamo.',
  'loan.borrow.unprocessable': 'No puedes solicitar más préstamos en este momento.',
  'loan.borrow.forbidden': 'No tienes permiso para realizar préstamos.',
  'loan.return.forbidden': 'No tienes permiso para devolver este préstamo.',
  'loan.return.notFound': 'El préstamo no fue encontrado.',
  'loan.return.conflict': 'Este libro ya fue devuelto anteriormente.',
};

export function getErrorMessage(key) {
  return ERROR_MESSAGES[key] ?? FALLBACK_ERROR;
}
