import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft } from "lucide-react";
import ToolLayout, { ToolInput, ToolOutput } from "@/components/ui/tool-layout";
import { useToolState } from "@/hooks/use-tool-state";

export default function PHPJSONConverter() {
  const [state, setState] = useToolState("php-json-converter", {
    input: "",
    output: "",
    error: ""
  });

  const { input, output, error } = state;

  const updateState = (updates: Partial<typeof state>) => {
    setState({ ...state, ...updates });
  };

    const phpToJson = () => {
    try {
      // Simple PHP array to JSON conversion
      // In a real app, you'd use a proper PHP parser
      let phpCode = input.trim();

      // Remove PHP tags and array declaration
      phpCode = phpCode.replace(/<\?php\s*/g, '');
      phpCode = phpCode.replace(/\$\w+\s*=\s*/g, '');
      phpCode = phpCode.replace(/;$/g, '');

      // Convert PHP array syntax to JSON
      phpCode = phpCode.replace(/array\s*\(/g, '[');
      phpCode = phpCode.replace(/\)/g, ']');
      phpCode = phpCode.replace(/=>/g, ':');
      phpCode = phpCode.replace(/'/g, '"');

      // Parse and format JSON
      const parsed = JSON.parse(phpCode);
      const json = JSON.stringify(parsed, null, 2);

      updateState({
        output: json,
        error: ""
      });
    } catch (err) {
      updateState({
        error: "Invalid PHP array syntax or conversion failed",
        output: ""
      });
    }
  };

  const jsonToPhp = () => {
    try {
      const parsed = JSON.parse(input);
      const php = jsonToPhpArray(parsed, 0);

      updateState({
        output: `<?php\n$data = ${php};\n?>`,
        error: ""
      });
    } catch (err) {
      updateState({
        error: "Invalid JSON or conversion failed",
        output: ""
      });
    }
  };

  const jsonToPhpArray = (obj: any, indent: number = 0): string => {
    const spaces = '    '.repeat(indent);

    if (Array.isArray(obj)) {
      if (obj.length === 0) return 'array()';

      const items = obj.map(item =>
        `${spaces}    ${jsonToPhpArray(item, indent + 1)}`
      ).join(',\n');

      return `array(\n${items}\n${spaces})`;
    } else if (obj !== null && typeof obj === 'object') {
      const items = Object.entries(obj).map(([key, value]) =>
        `${spaces}    '${key}' => ${jsonToPhpArray(value, indent + 1)}`
      ).join(',\n');

      return `array(\n${items}\n${spaces})`;
    } else if (typeof obj === 'string') {
      return `'${obj.replace(/'/g, "\\'")}'`;
    } else if (typeof obj === 'boolean') {
      return obj ? 'true' : 'false';
    } else if (obj === null) {
      return 'null';
    } else {
      return String(obj);
    }
  };

  const clearAll = () => {
    updateState({
      input: "",
      output: "",
      error: ""
    });
  };

  const loadPhpExample = () => {
    const example = `<?php
$data = array(
    'name' => 'John Doe',
    'age' => 30,
    'city' => 'New York',
    'hobbies' => array('reading', 'swimming', 'coding'),
    'active' => true
);
?>`;
    updateState({ input: example });
  };

  const loadJsonExample = () => {
    const example = `{
  "name": "John Doe",
  "age": 30,
  "city": "New York",
  "hobbies": ["reading", "swimming", "coding"],
  "active": true
}`;
    updateState({ input: example });
  };

  return (
    <ToolLayout
      title="PHP ↔ JSON Converter"
      description="Convert between PHP and JSON formats"
      icon={<ArrowRightLeft className="h-6 w-6 text-blue-500" />}
      outputValue={output}
      infoContent={
        <p>
          PHP and JSON conversion allows data interchange between PHP applications and web APIs.
          This tool converts PHP associative arrays to JSON format and vice versa, preserving data types and structure.
        </p>
      }
    >
      <ToolInput title="Input">
        <div className="space-y-4">
          <div>
            <Label htmlFor="php-json-input">PHP Array or JSON Data</Label>
            <Textarea
              id="php-json-input"
              placeholder="Enter PHP array or JSON data"
              value={input}
              onChange={(e) => updateState({ input: e.target.value })}
              className="tool-textarea"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={phpToJson}>PHP → JSON</Button>
            <Button variant="outline" onClick={jsonToPhp}>JSON → PHP</Button>
            <Button variant="outline" onClick={loadPhpExample}>Load PHP Example</Button>
            <Button variant="outline" onClick={loadJsonExample}>Load JSON Example</Button>
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
            <Label>Converted Data</Label>
            <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1 whitespace-pre-wrap max-h-96 overflow-y-auto">
              {output || "No output"}
            </div>
          </div>
        </div>
      </ToolOutput>
    </ToolLayout>
  );
}
