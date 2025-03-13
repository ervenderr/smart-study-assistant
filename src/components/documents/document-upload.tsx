"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { UploadDropzone } from "@uploadthing/react";

export function DocumentUpload() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleCreateDocument = async (name: string, url: string) => {
    try {
      setIsUploading(true);
      console.log("Creating document with:", { name, url });

      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: name,
          fileUrl: url,
          fileType: "pdf",
        }),
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to create document");
      }

      toast.success("Document uploaded successfully");
      router.refresh();
      router.push(`/documents/${data.id}`);
      setOpen(false);
    } catch (error) {
      console.error("Document creation error details:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
      });
      toast.error(
        error instanceof Error ? error.message : "Failed to create document"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Upload Document</Button>
      </DialogTrigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          style={{
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "450px",
            zIndex: 51,
            background: "white",
            borderRadius: "0.5rem",
            padding: "1.5rem",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          }}
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 dark:bg-slate-950"
        >
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload your PDF document to start studying. Click or drag and drop
              your file below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <UploadDropzone
              endpoint="pdfUploader"
              onUploadBegin={() => {
                setIsUploading(true);
                toast.info("Starting upload...");
              }}
              onUploadError={(error: Error) => {
                setIsUploading(false);
                console.error("Upload error details:", {
                  error,
                  message: error.message,
                });
                toast.error(`Upload failed: ${error.message}`);
              }}
              onClientUploadComplete={(res) => {
                setIsUploading(false);
                if (!res?.[0]) {
                  console.error("No upload result received");
                  return;
                }

                console.log("Upload completed:", res[0]);
                handleCreateDocument(res[0].name, res[0].url);
              }}
            />
          </div>
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none">
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
}
