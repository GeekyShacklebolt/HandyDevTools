import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Eye, EyeOff } from "lucide-react";
import ToolLayout, { ToolInput, ToolOutput } from "@/components/ui/tool-layout";
import { useToolState } from "@/hooks/use-tool-state";

export default function MarkdownPreview() {
  const [state, setState] = useToolState("markdown-preview", {
    input: "",
    showPreview: true
  });

  const { input, showPreview } = state;

  const updateState = (updates: Partial<typeof state>) => {
    setState({ ...state, ...updates });
  };

  const convertMarkdownToHTML = (markdown: string): string => {
    return markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      // Code inline
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />')
      // Lists
      .replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>')
      .replace(/^\- (.*$)/gim, '<ul><li>$1</li></ul>')
      .replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>')
      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      // Horizontal rules
      .replace(/^---$/gim, '<hr>')
      // Line breaks
      .replace(/\n/g, '<br>');
  };

  const clearAll = () => {
    updateState({ input: "" });
  };

  const loadExample = () => {
    const example = `# Markdown Preview Example

## Introduction
This is a **sample** markdown document to demonstrate the preview functionality.

### Features
- *Italic text*
- **Bold text**
- \`Inline code\`
- [Links](https://example.com)

### Code Block
\`\`\`javascript
function hello() {
    console.log("Hello, World!");
}
\`\`\`

### Blockquote
> This is a blockquote example.
> It can span multiple lines.

### List
1. First item
2. Second item
3. Third item

---

That's all folks!`;
    updateState({ input: example });
  };

  const htmlOutput = convertMarkdownToHTML(input);

  return (
    <ToolLayout
      title="Markdown Preview"
      description="Preview Markdown with live rendering"
      icon={<FileText className="h-6 w-6 text-blue-500" />}
      outputValue={input}
      infoContent={
        <p>
          Markdown is a lightweight markup language that allows you to add formatting elements to plain text.
          This tool provides a live preview of how your Markdown will render as HTML.
        </p>
      }
    >
      <ToolInput title="Input">
        <div className="space-y-4">
          <div>
            <Label htmlFor="markdown-input">Markdown Content</Label>
            <Textarea
              id="markdown-input"
              placeholder="Enter Markdown content"
              value={input}
              onChange={(e) => updateState({ input: e.target.value })}
              className="tool-textarea"
            />
          </div>

          <div className="flex flex-wrap gap-2">
                        <Button
              variant="outline"
              onClick={() => updateState({ showPreview: !showPreview })}
            >
              {showPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            <Button variant="outline" onClick={loadExample}>Load Example</Button>
            <Button variant="outline" onClick={clearAll}>Clear</Button>
          </div>
        </div>
      </ToolInput>

      <ToolOutput title="Preview" value={input} canCopy={false}>
        <div className="space-y-4">
          {showPreview && input ? (
            <div>
              <Label>Rendered Preview</Label>
              <div
                className="p-4 bg-muted rounded-md mt-1 prose prose-sm max-w-none dark:prose-invert max-h-96 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: htmlOutput }}
                style={{
                  lineHeight: '1.6',
                }}
              />
            </div>
          ) : showPreview ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Enter Markdown content to see the preview
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Preview is hidden. Click "Show Preview" to see the rendered output.
            </div>
          )}

          {input && (
            <div>
              <Label>Raw HTML Output</Label>
              <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1 whitespace-pre-wrap max-h-32 overflow-y-auto">
                {htmlOutput}
              </div>
            </div>
          )}
        </div>
      </ToolOutput>
    </ToolLayout>
  );
}
