"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileCode, CheckCircle2 } from "lucide-react";
import { GitHubUrlInput } from "./github-url-input";
import { FolderUploadInput } from "./folder-upload-input";
import type { SourceData } from "@/lib/types";

interface SourceInputProps {
  sourceData: SourceData | null;
  onSourceLoaded: (data: SourceData) => void;
  onError: (error: string) => void;
}

export function SourceInput({
  sourceData,
  onSourceLoaded,
  onError,
}: SourceInputProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileCode className="h-5 w-5" />
            Source Code
          </CardTitle>
          {sourceData && (
            <Badge variant="secondary" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              {sourceData.fileTree.length} files loaded
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="github">
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="github">GitHub</TabsTrigger>
            <TabsTrigger value="folder">Folder</TabsTrigger>
          </TabsList>
          <TabsContent value="github">
            <GitHubUrlInput onSourceLoaded={onSourceLoaded} onError={onError} />
          </TabsContent>
          <TabsContent value="folder">
            <FolderUploadInput onSourceLoaded={onSourceLoaded} onError={onError} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
