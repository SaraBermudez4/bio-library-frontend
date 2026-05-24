'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { bookSchema } from '@/lib/schemas';
import { BOOK_CATEGORIES } from '@/lib/constants';
import { Button } from '@/lib/components/ui/button';
import { Textarea } from '@/lib/components/ui/textarea';
import { Label } from '@/lib/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/lib/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/lib/components/ui/dialog';
import { FormField } from './FormField';
import { ErrorAlert } from './ErrorAlert';
import { cn } from '@/lib/utils';

// categories: string[] from GET /v1/books/categories, or null while loading.
// Falls back to the static BOOK_CATEGORIES constant when not provided.
export function BookFormModal({ show, onHide, onSubmit, book, isLoading, error, categories }) {
  const isEdit = !!book;

  const categoryOptions = categories
    ? categories.map((c) => {
        const found = BOOK_CATEGORIES.find((bc) => bc.value === c);
        return found ?? { value: c, label: c };
      })
    : BOOK_CATEGORIES;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({ resolver: zodResolver(bookSchema) });

  useEffect(() => {
    if (show) {
      reset(
        book
          ? {
              title: book.title,
              author: `${book.author.name} ${book.author.lastName}`.trim(),
              isbn: book.isbn,
              category: book.category ?? '',
              synopsis: book.synopsis,
              pdfUrl: book.pdfUrl,
              coverImageUrl: book.coverImageUrl ?? '',
              maxConcurrentLoans: book.license.maxConcurrentLoans,
            }
          : {
              title: '',
              author: '',
              isbn: '',
              category: '',
              synopsis: '',
              pdfUrl: '',
              coverImageUrl: '',
              maxConcurrentLoans: 1,
            },
      );
    }
  }, [show, book, reset]);

  function handleFormSubmit(formData) {
    onSubmit({
      title: formData.title,
      author: formData.author,
      isbn: formData.isbn,
      category: formData.category,
      synopsis: formData.synopsis,
      pdfUrl: formData.pdfUrl,
      coverImageUrl: formData.coverImageUrl || null,
      maxConcurrentLoans: formData.maxConcurrentLoans,
    });
  }

  return (
    <Dialog open={show} onOpenChange={(open) => { if (!open) onHide(); }}>
      <DialogContent className="sm:max-w-lg" showCloseButton={!isLoading}>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar libro' : 'Registrar libro'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <div className="py-2 space-y-1">
            <ErrorAlert error={error} />
            <FormField label="Título" name="title" register={register} error={errors.title} />
            <FormField label="Autor" name="author" register={register} error={errors.author} />
            <FormField label="ISBN" name="isbn" register={register} error={errors.isbn} />
            <div className="space-y-1 mb-4">
              <Label htmlFor="category">Categoría</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="category"
                      aria-invalid={!!errors.category}
                      className={cn('w-full', errors.category && 'border-destructive')}
                    >
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>
            <div className="space-y-1 mb-4">
              <Label htmlFor="synopsis">Descripción</Label>
              <Textarea
                id="synopsis"
                rows={3}
                aria-invalid={!!errors.synopsis}
                className={cn(errors.synopsis && 'border-destructive')}
                {...register('synopsis')}
              />
              {errors.synopsis && (
                <p className="text-sm text-destructive">{errors.synopsis.message}</p>
              )}
            </div>
            <FormField label="URL del PDF" name="pdfUrl" type="url" register={register} error={errors.pdfUrl} />
            <FormField label="URL de portada (opcional)" name="coverImageUrl" type="url" register={register} error={errors.coverImageUrl} />
            <FormField
              label="Total de licencias"
              name="maxConcurrentLoans"
              type="number"
              register={register}
              error={errors.maxConcurrentLoans}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onHide} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isLoading ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Registrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
