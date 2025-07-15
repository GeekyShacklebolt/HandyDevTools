import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Code } from "lucide-react";
import ToolLayout, { ToolInput, ToolOutput } from "@/components/ui/tool-layout";
import { escapeBackslashes, unescapeBackslashes } from "@/lib/utils/converters";

export default function BackslashEscape() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const escape = () => {
    const escaped = escapeBackslashes(input);
    setOutput(escaped);
  };

  const unescape = () => {
    const unescaped = unescapeBackslashes(input);
    setOutput(unescaped);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
  };

  const loadExample = () => {
    setInput('C:\\Users\\John\\Documents\\file.txt');
  };

  return (
    <ToolLayout
      title="Backslash Escape/Unescape"
      description="Escape and unescape backslashes"
      icon={<Code className="h-6 w-6 text-blue-500" />}
      outputValue={output}
      infoContent={
        <p>
          Backslash escaping is used to handle backslashes in strings, particularly useful when dealing with 
          file paths, regular expressions, or JSON strings where backslashes need to be escaped or unescaped.
        </p>
      }
    >
      <ToolInput title="Input">
        <div className="space-y-4">
          <div>
            <Label htmlFor="backslash-input">Text with Backslashes</Label>
            <Textarea
              id="backslash-input"
              placeholder="Enter text with backslashes"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="tool-textarea"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={escape}>Escape Backslashes</Button>
            <Button variant="outline" onClick={unescape}>Unescape Backslashes</Button>
            <Button variant="outline" onClick={loadExample}>Load Example</Button>
            <Button variant="outline" onClick={clearAll}>Clear</Button>
          </div>
        </div>
      </ToolInput>

      <ToolOutput title="Output" value={output}>
        <div className="space-y-4">
          <div>
            <Label>Result</Label>
            <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1 whitespace-pre-wrap max-h-96 overflow-y-auto">
              {output || "No output"}
            </div>
          </div>
        </div>
      </ToolOutput>
    </ToolLayout>
  );
}
