import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, Info } from "lucide-react";

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  outputValue?: string;
  infoContent?: React.ReactNode;
}

export default function ToolLayout({
  title,
  description,
  icon,
  children,
  outputValue,
  infoContent
}: ToolLayoutProps) {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    if (!outputValue) return;

    try {
      await navigator.clipboard.writeText(outputValue);
      toast({
        title: "Copied!",
        description: "Output copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Tool Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            {icon}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>

      {/* Tool Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {children}
      </div>

      {/* Info Section */}
      {infoContent && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-200 flex items-center">
              <Info className="mr-2 h-5 w-5" />
              Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-blue-800 dark:text-blue-300 text-sm leading-relaxed">
              {infoContent}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface ToolInputProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  headerActions?: React.ReactNode;
}

export function ToolInput({ title, children, actions, headerActions }: ToolInputProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <div className="p-1 bg-blue-100 dark:bg-blue-900/20 rounded mr-2">
              <div className="h-4 w-4 bg-blue-500 dark:bg-blue-400 rounded-sm" />
            </div>
            {title}
          </CardTitle>
          {headerActions}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
        {actions && <div className="flex space-x-2">{actions}</div>}
      </CardContent>
    </Card>
  );
}

interface ToolOutputProps {
  title: string;
  value: string;
  canCopy?: boolean;
  children?: React.ReactNode;
}

export function ToolOutput({ title, value, canCopy = true, children }: ToolOutputProps) {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast({
        title: "Copied!",
        description: "Output copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <div className="p-1 bg-green-100 dark:bg-green-900/20 rounded mr-2">
              <div className="h-4 w-4 bg-green-500 dark:bg-green-400 rounded-sm" />
            </div>
            {title}
          </CardTitle>
          {canCopy && (
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              disabled={!value}
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
