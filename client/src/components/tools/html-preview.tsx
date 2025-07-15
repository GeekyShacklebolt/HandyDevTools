import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Eye, AlertTriangle } from "lucide-react";
import ToolLayout, { ToolInput, ToolOutput } from "@/components/ui/tool-layout";

export default function HTMLPreview() {
  const [input, setInput] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const preview = () => {
    setShowPreview(true);
  };

  const hidePreview = () => {
    setShowPreview(false);
  };

  const clearAll = () => {
    setInput("");
    setShowPreview(false);
  };

  const loadExample = () => {
    const example = `<!DOCTYPE html>
<html>
<head>
    <title>Example Page</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        .highlight { background-color: yellow; }
    </style>
</head>
<body>
    <h1>Hello World!</h1>
    <p>This is a <span class="highlight">highlighted</span> paragraph.</p>
    <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
    </ul>
</body>
</html>`;
    setInput(example);
  };

  return (
    <ToolLayout
      title="HTML Preview"
      description="Preview HTML code in real-time"
      icon={<Eye className="h-6 w-6 text-blue-500" />}
      outputValue={input}
      infoContent={
        <div>
          <p className="mb-2">
            HTML preview allows you to see how your HTML code will render in a browser. 
            This is useful for testing and debugging HTML structure and styling.
          </p>
          <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-md">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Warning: Only preview trusted HTML code. Malicious code can be dangerous.
              </span>
            </div>
          </div>
        </div>
      }
    >
      <ToolInput title="Input">
        <div className="space-y-4">
          <div>
            <Label htmlFor="html-input">HTML Code</Label>
            <Textarea
              id="html-input"
              placeholder="Enter HTML code to preview"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="tool-textarea"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={preview}>Preview</Button>
            <Button variant="outline" onClick={hidePreview}>Hide Preview</Button>
            <Button variant="outline" onClick={loadExample}>Load Example</Button>
            <Button variant="outline" onClick={clearAll}>Clear</Button>
          </div>
        </div>
      </ToolInput>

      <ToolOutput title="Output" value={input} canCopy={false}>
        <div className="space-y-4">
          {showPreview && input && (
            <div>
              <Label>HTML Preview</Label>
              <div className="mt-1 border border-gray-200 dark:border-gray-700 rounded-md">
                <iframe
                  srcDoc={input}
                  className="w-full h-96 rounded-md"
                  title="HTML Preview"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          )}
          
          {!showPreview && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Click "Preview" to see the HTML output
            </div>
          )}
        </div>
      </ToolOutput>
    </ToolLayout>
  );
}
