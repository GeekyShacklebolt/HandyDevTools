import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Type } from "lucide-react";
import ToolLayout, { ToolInput, ToolOutput } from "@/components/ui/tool-layout";
import { convertStringCase } from "@/lib/utils/converters";
import { useToolState } from "@/hooks/use-tool-state";

export default function StringCaseConverter() {
  const [state, setState] = useToolState("string-case-converter", {
    input: "",
    outputs: {
      camelCase: "",
      PascalCase: "",
      snake_case: "",
      "kebab-case": "",
      SCREAMING_SNAKE_CASE: "",
      lowercase: "",
      UPPERCASE: "",
      "Title Case": ""
    }
  });

  const { input, outputs } = state;

  const updateState = (updates: Partial<typeof state>) => {
    setState({ ...state, ...updates });
  };

  const convertAll = () => {
    if (!input.trim()) {
      updateState({
        outputs: {
          camelCase: "",
          PascalCase: "",
          snake_case: "",
          "kebab-case": "",
          SCREAMING_SNAKE_CASE: "",
          lowercase: "",
          UPPERCASE: "",
          "Title Case": ""
        }
      });
      return;
    }

    updateState({
      outputs: {
        camelCase: convertStringCase(input, 'camelCase'),
        PascalCase: convertStringCase(input, 'PascalCase'),
        snake_case: convertStringCase(input, 'snake_case'),
        "kebab-case": convertStringCase(input, 'kebab-case'),
        SCREAMING_SNAKE_CASE: convertStringCase(input, 'SCREAMING_SNAKE_CASE'),
        lowercase: convertStringCase(input, 'lowercase'),
        UPPERCASE: convertStringCase(input, 'UPPERCASE'),
        "Title Case": convertStringCase(input, 'Title Case')
      }
    });
  };

  const clearAll = () => {
    updateState({
      input: "",
      outputs: {
        camelCase: "",
        PascalCase: "",
        snake_case: "",
        "kebab-case": "",
        SCREAMING_SNAKE_CASE: "",
        lowercase: "",
        UPPERCASE: "",
        "Title Case": ""
      }
    });
  };

  const loadExample = () => {
    updateState({ input: "Hello World Example Text" });
  };

  const formatOutput = () => {
    return Object.entries(outputs)
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
  };

  return (
    <ToolLayout
      title="String Case Converter"
      description="Convert between different string cases"
      icon={<Type className="h-6 w-6 text-blue-500" />}
      outputValue={formatOutput()}
      infoContent={
        <p>
          String case conversion transforms text between different naming conventions used in programming.
          Each case style has specific use cases: camelCase for JavaScript variables, snake_case for Python,
          kebab-case for URLs, etc.
        </p>
      }
    >
      <ToolInput title="Input">
        <div className="space-y-4">
          <div>
            <Label htmlFor="string-input">Text to Convert</Label>
            <Input
              id="string-input"
              placeholder="Enter text to convert"
              value={input}
              onChange={(e) => {
                const newValue = e.target.value;
                updateState({ input: newValue });
                // Auto-convert on typing
                setTimeout(() => convertAll(), 100);
              }}
              className="tool-input"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={convertAll}>Convert All</Button>
            <Button variant="outline" onClick={loadExample}>Load Example</Button>
            <Button variant="outline" onClick={clearAll}>Clear</Button>
          </div>
        </div>
      </ToolInput>

      <ToolOutput title="Output" value={formatOutput()}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>camelCase</Label>
              <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1">
                {outputs.camelCase || "No output"}
              </div>
            </div>

            <div>
              <Label>PascalCase</Label>
              <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1">
                {outputs.PascalCase || "No output"}
              </div>
            </div>

            <div>
              <Label>snake_case</Label>
              <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1">
                {outputs.snake_case || "No output"}
              </div>
            </div>

            <div>
              <Label>kebab-case</Label>
              <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1">
                {outputs["kebab-case"] || "No output"}
              </div>
            </div>

            <div>
              <Label>SCREAMING_SNAKE_CASE</Label>
              <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1">
                {outputs.SCREAMING_SNAKE_CASE || "No output"}
              </div>
            </div>

            <div>
              <Label>lowercase</Label>
              <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1">
                {outputs.lowercase || "No output"}
              </div>
            </div>

            <div>
              <Label>UPPERCASE</Label>
              <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1">
                {outputs.UPPERCASE || "No output"}
              </div>
            </div>

            <div>
              <Label>Title Case</Label>
              <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1">
                {outputs["Title Case"] || "No output"}
              </div>
            </div>
          </div>
        </div>
      </ToolOutput>
    </ToolLayout>
  );
}
