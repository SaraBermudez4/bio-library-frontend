'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/lib/components/ui/button';
import { LoadingSpinner } from '@/lib/components/shared/LoadingSpinner';
import { ErrorAlert } from '@/lib/components/shared/ErrorAlert';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export function PdfReader({ url, onPageChange }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState(null);

  function onLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function onLoadError() {
    setError('No se pudo cargar el PDF.');
  }

  function goToPrev() {
    const newPage = pageNumber - 1;
    setPageNumber(newPage);
    onPageChange?.(newPage);
  }

  function goToNext() {
    const newPage = pageNumber + 1;
    setPageNumber(newPage);
    onPageChange?.(newPage);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <ErrorAlert error={error} />
      {!error && (
        <Document
          file={url}
          onLoadSuccess={onLoadSuccess}
          onLoadError={onLoadError}
          loading={<LoadingSpinner />}
        >
          <Page
            pageNumber={pageNumber}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            loading={<LoadingSpinner />}
          />
        </Document>
      )}
      {numPages && (
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrev}
            disabled={pageNumber === 1}
          >
            <ChevronLeft className="size-4" />
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {pageNumber} de {numPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            disabled={pageNumber === numPages}
          >
            Siguiente
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
