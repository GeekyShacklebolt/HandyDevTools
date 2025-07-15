import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Code } from "lucide-react";
import ToolLayout, { ToolInput, ToolOutput } from "@/components/ui/tool-layout";
import { base64Encode, base64Decode } from "@/lib/utils/converters";

export default function Base64Encoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const encode = () => {
    try {
      const encoded = base64Encode(input);
      setOutput(encoded);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Encoding failed");
      setOutput("");
    }
  };

  const decode = () => {
    try {
      const decoded = base64Decode(input);
      setOutput(decoded);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Decoding failed");
      setOutput("");
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <ToolLayout
      title="Base64 String Encoder/Decoder"
      description="Encode and decode Base64 strings"
      icon={<Code className="h-6 w-6 text-blue-500" />}
      outputValue={output}
      infoContent={
        <p>
          Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. 
          It's commonly used to encode data that needs to be transmitted over media that are designed to deal 
          with textual data.
        </p>
      }
    >
      <ToolInput title="Input">
        <div className="space-y-4">
          <div>
            <Label htmlFor="base64-input">Text or Base64 String</Label>
            <Textarea
              id="base64-input"
              placeholder="Enter text to encode or Base64 string to decode"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="tool-textarea"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={encode}>Encode to Base64</Button>
            <Button variant="outline" onClick={decode}>Decode from Base64</Button>
            <Button variant="outline" onClick={clearAll}>Clear</Button>
          </div>
        </div>
      </ToolInput>

      <ToolOutput title="Output" value={output}>
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-md">
              {error}
            </div>
          )}
          
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
