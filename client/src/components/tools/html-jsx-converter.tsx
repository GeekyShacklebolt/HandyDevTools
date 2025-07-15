import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Code } from "lucide-react";
import ToolLayout, { ToolInput, ToolOutput } from "@/components/ui/tool-layout";
import { htmlToJsx } from "@/lib/utils/advanced-converters";

export default function HTMLJSXConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const convert = () => {
    if (!input.trim()) {
      setOutput("");
      return;
    }
    
    const jsx = htmlToJsx(input);
    setOutput(jsx);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
  };

  const loadExample = () => {
    const example = `<div class="container">
  <h1>Welcome to React</h1>
  <form>
    <label for="username">Username:</label>
    <input type="text" id="username" class="form-input" readonly />
    <input type="submit" value="Submit" />
  </form>
  <p>This is a <span class="highlight">highlighted</span> text.</p>
  <!-- This is a comment -->
</div>`;
    setInput(example);
  };

  return (
    <ToolLayout
      title="HTML to JSX Converter"
      description="Convert HTML to JSX format"
      icon={<Code className="h-6 w-6 text-blue-500" />}
      outputValue={output}
      infoContent={
        <p>
          HTML to JSX converter transforms HTML markup into JSX syntax used in React. 
          It converts HTML attributes to their JSX equivalents (class → className, for → htmlFor, etc.) 
          and handles other React-specific requirements.
        </p>
      }
    >
      <ToolInput title="Input">
        <div className="space-y-4">
          <div>
            <Label htmlFor="html-input">HTML Code</Label>
            <Textarea
              id="html-input"
              placeholder="Enter HTML code to convert to JSX"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // Auto-convert on typing
                if (e.target.value.trim()) {
                  const jsx = htmlToJsx(e.target.value);
                  setOutput(jsx);
                } else {
                  setOutput("");
                }
              }}
              className="tool-textarea"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={convert}>Convert to JSX</Button>
            <Button variant="outline" onClick={loadExample}>Load Example</Button>
            <Button variant="outline" onClick={clearAll}>Clear</Button>
          </div>
        </div>
      </ToolInput>

      <ToolOutput title="Output" value={output}>
        <div className="space-y-4">
          <div>
            <Label>JSX Code</Label>
            <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1 whitespace-pre-wrap max-h-96 overflow-y-auto">
              {output || "No output"}
            </div>
          </div>
          
          {output && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <h4 className="text-blue-900 dark:text-blue-200 font-medium mb-2">Conversion Summary</h4>
              <div className="text-blue-800 dark:text-blue-300 text-sm">
                <ul className="list-disc list-inside space-y-1">
                  <li>class → className</li>
                  <li>for → htmlFor</li>
                  <li>HTML comments → JSX comments</li>
                  <li>Various HTML attributes → React props</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </ToolOutput>
    </ToolLayout>
  );
}
