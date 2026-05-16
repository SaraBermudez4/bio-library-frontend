import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email o contraseña incorrectos'),
  password: z.string().min(1, 'Email o contraseña incorrectos'),
});

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  university: z.string().min(1, 'Selecciona una universidad'),
  carnet: z.string().min(1, 'El carnet es obligatorio'),
  dni: z.string().min(1, 'El DNI es obligatorio'),
  phoneNumber: z.string().min(1, 'El teléfono es obligatorio'),
});

export const bookSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  author: z.string().min(1, 'El autor es obligatorio'),
  isbn: z.string().min(1, 'El ISBN es obligatorio'),
  synopsis: z.string().min(1, 'La descripción es obligatoria'),
  pdfUrl: z.string().url('Debe ser una URL válida'),
  coverImageUrl: z
    .string()
    .url('Debe ser una URL válida')
    .or(z.literal(''))
    .optional(),
  maxConcurrentLoans: z.coerce
    .number({ invalid_type_error: 'Debe ser un número' })
    .int('Debe ser entero')
    .min(1, 'Mínimo 1 licencia'),
});

export const studentCreateSchema = z.object({
  carnet: z.string().min(1, 'El carnet es obligatorio'),
  dni: z.string().min(1, 'El DNI es obligatorio'),
  name: z.string().min(1, 'El nombre es obligatorio'),
  lastName: z.string().min(1, 'El apellido es obligatorio'),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  phoneNumber: z.string().min(1, 'El teléfono es obligatorio'),
  university: z.string().min(1, 'Selecciona una universidad'),
});
