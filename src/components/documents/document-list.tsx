"use client";

import { Document } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DocumentListProps {
  documents: (Document & {
    course: { title: string } | null;
  })[];
}

export function DocumentList({ documents }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">
          No documents yet. Upload your first document to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {documents.map((document) => (
        <Link key={document.id} href={`/documents/${document.id}`}>
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader>
              <CardTitle className="line-clamp-1">{document.title}</CardTitle>
              <CardDescription>
                <div className="flex flex-col space-y-1">
                  <span>
                    Added{" "}
                    {formatDistanceToNow(document.createdAt, {
                      addSuffix: true,
                    })}
                  </span>
                  {document.course && (
                    <span className="text-primary">
                      Course: {document.course.title}
                    </span>
                  )}
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}
