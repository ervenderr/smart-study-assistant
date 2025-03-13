"use client";

import { useState, useRef } from "react";
import { Document } from "@prisma/client";
import { Loader2 } from "lucide-react";

interface DocumentViewerProps {
  document: Document;
}

export function DocumentViewer({ document }: DocumentViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-full max-w-4xl border rounded-lg bg-background p-4 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(
            document.fileUrl
          )}&embedded=true`}
          className="w-full min-h-[800px]"
          onLoad={handleIframeLoad}
          title={document.title}
        />
      </div>
    </div>
  );
}
