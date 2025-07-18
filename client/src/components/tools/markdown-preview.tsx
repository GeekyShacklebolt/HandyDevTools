import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";
import ToolLayout, { ToolInput, ToolOutput } from "@/components/ui/tool-layout";
import { useToolState } from "@/hooks/use-tool-state";

export default function MarkdownPreview() {
  const [state, setState] = useToolState("markdown-preview", {
    input: ""
  });

  const { input } = state;

  const updateState = (updates: Partial<typeof state>) => {
    setState({ ...state, ...updates });
  };

  const convertMarkdownToHTML = (markdown: string): string => {
    // Split into lines for better processing
    const lines = markdown.split('\n');
    const processedLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let processedLine = line;

      // Process inline formatting first
      processedLine = processedLine
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/__(.*?)__/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/_(.*?)_/g, '<em>$1</em>')
        // Code inline
        .replace(/`(.*?)`/g, '<code>$1</code>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        // Images
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />');

      // Process block elements
      if (line.match(/^### (.*$)/)) {
        processedLine = `<h3>${line.replace(/^### /, '')}</h3>`;
      } else if (line.match(/^## (.*$)/)) {
        processedLine = `<h2>${line.replace(/^## /, '')}</h2>`;
      } else if (line.match(/^# (.*$)/)) {
        processedLine = `<h1>${line.replace(/^# /, '')}</h1>`;
      } else if (line.match(/^> (.*$)/)) {
        processedLine = `<blockquote>${line.replace(/^> /, '')}</blockquote>`;
      } else if (line.match(/^---$/)) {
        processedLine = '<hr>';
      } else if (line.match(/^\* (.*$)/) || line.match(/^\- (.*$)/)) {
        processedLine = `<li>${line.replace(/^[\*\-] /, '')}</li>`;
      } else if (line.match(/^\d+\. (.*$)/)) {
        processedLine = `<li>${line.replace(/^\d+\. /, '')}</li>`;
      } else if (line.trim() === '') {
        // Empty lines become paragraph breaks
        processedLine = '</p><p>';
      } else {
        // Regular text lines
        processedLine = processedLine;
      }

      processedLines.push(processedLine);
    }

    // Join lines and handle special cases
    let result = processedLines.join('\n');

    // Handle code blocks (multi-line)
    result = result.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Handle lists properly
    result = result.replace(/(<li>.*<\/li>)/g, (match) => {
      // Check if it's a numbered list or bullet list
      const isNumbered = match.includes('<li>') && /^\d+\./.test(match);
      const listType = isNumbered ? 'ol' : 'ul';
      return `<${listType}>${match}</${listType}>`;
    });

    // Wrap in paragraphs and clean up
    result = result
      .replace(/^(?!<[hou][1-6lr]|<p>|<blockquote>|<pre>|<hr>)(.+)$/gm, '<p>$1</p>')
      .replace(/<\/p>\s*<p>/g, '</p><p>')
      .replace(/<p><\/p>/g, '') // Remove empty paragraphs
      .replace(/<p>(<[hou][1-6lr]|<blockquote>|<pre>|<hr>)/g, '$1') // Remove p tags around block elements
      .replace(/(<\/[hou][1-6lr]|<\/blockquote>|<\/pre>|<\/hr>)<\/p>/g, '$1'); // Remove closing p tags around block elements

    return result;
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
            <Button variant="outline" onClick={loadExample}>Load Example</Button>
            <Button variant="outline" onClick={clearAll}>Clear</Button>
          </div>
        </div>
      </ToolInput>

      <ToolOutput title="Preview" value={input} canCopy={false}>
        <div className="space-y-4">
          {input ? (
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
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Enter Markdown content to see the preview
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
