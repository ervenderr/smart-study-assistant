"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Document as PDFDocument, Page, pdfjs } from "react-pdf";
import { Document } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentViewerProps {
  document: Document;
}

export function DocumentViewer({ document }: DocumentViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [workerInitialized, setWorkerInitialized] = useState(false);

  useEffect(() => {
    const initWorker = async () => {
      try {
        const worker = await import("pdfjs-dist/build/pdf.worker.min.js");
        pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
        setWorkerInitialized(true);
      } catch (error) {
        console.error("Failed to load PDF worker:", error);
      }
    };

    initWorker();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  if (!workerInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        ref={containerRef}
        className="w-full max-w-4xl border rounded-lg bg-background p-4"
      >
        <PDFDocument
          file={document.fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center min-h-[600px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }
          error={
            <div className="flex items-center justify-center min-h-[600px] text-destructive">
              Failed to load PDF document. Please make sure the URL is
              accessible.
            </div>
          }
          className="max-w-full"
        >
          <Page
            pageNumber={pageNumber}
            width={containerWidth ? containerWidth - 32 : undefined}
            loading={
              <div className="flex items-center justify-center min-h-[600px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            }
            className="max-h-[800px] overflow-auto"
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </PDFDocument>
      </div>

      {numPages && numPages > 1 && (
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {pageNumber} of {numPages}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setPageNumber((prev) => Math.min(prev + 1, numPages ?? prev))
            }
            disabled={pageNumber >= (numPages ?? 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
