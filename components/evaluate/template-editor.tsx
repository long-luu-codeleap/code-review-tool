"use client";

import { useState } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface TemplateEditorProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  defaultValue: string;
  onChange: (value: string) => void;
}

export function TemplateEditor({
  title,
  icon,
  value,
  defaultValue,
  onChange,
}: TemplateEditorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger className="flex w-full items-center justify-between cursor-pointer">
            <CardTitle className="flex items-center gap-2 text-lg">
              {icon}
              {title}
            </CardTitle>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-3 pt-0">
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="min-h-75 font-mono text-sm"
            />
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange(defaultValue)}
                className="gap-1 text-xs"
              >
                <RotateCcw className="h-3 w-3" />
                Reset to Default
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
