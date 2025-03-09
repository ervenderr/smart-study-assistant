"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UploadDropzone } from "@uploadthing/react";

export function DocumentUpload() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateDocument = async (name: string, url: string) => {
    try {
      setIsCreating(true);
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
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Upload Document</Button>
      </DialogTrigger>
      <DialogContent>
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
              toast.info("Starting upload...");
            }}
            onUploadError={(error: Error) => {
              console.error("Upload error details:", {
                error,
                message: error.message,
              });
              toast.error(`Upload failed: ${error.message}`);
            }}
            onClientUploadComplete={(res) => {
              if (!res?.[0]) {
                console.error("No upload result received");
                return;
              }

              console.log("Upload completed:", res[0]);
              handleCreateDocument(res[0].name, res[0].url);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
