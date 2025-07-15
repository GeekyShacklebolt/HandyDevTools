import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft } from "lucide-react";
import ToolLayout, { ToolInput, ToolOutput } from "@/components/ui/tool-layout";
import { yamlToJson, jsonToYaml } from "@/lib/utils/advanced-converters";

export default function YAMLJSONConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convertToJson = () => {
    try {
      const json = yamlToJson(input);
      setOutput(json);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "YAML to JSON conversion failed");
      setOutput("");
    }
  };

  const convertToYaml = () => {
    try {
      const yaml = jsonToYaml(input);
      setOutput(yaml);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "JSON to YAML conversion failed");
      setOutput("");
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const loadExample = () => {
    const example = `name: John Doe
age: 30
address:
  street: 123 Main St
  city: Anytown
  country: USA
hobbies:
  - reading
  - swimming
  - coding`;
    setInput(example);
  };

  return (
    <ToolLayout
      title="YAML ↔ JSON Converter"
      description="Convert between YAML and JSON formats"
      icon={<ArrowRightLeft className="h-6 w-6 text-blue-500" />}
      outputValue={output}
      infoContent={
        <p>
          YAML (YAML Ain't Markup Language) is a human-readable data serialization standard. 
          This tool converts between YAML and JSON formats, making it easy to work with configuration 
          files and data interchange formats.
        </p>
      }
    >
      <ToolInput title="Input">
        <div className="space-y-4">
          <div>
            <Label htmlFor="yaml-json-input">YAML or JSON Data</Label>
            <Textarea
              id="yaml-json-input"
              placeholder="Enter YAML or JSON data"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="tool-textarea"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={convertToJson}>YAML → JSON</Button>
            <Button variant="outline" onClick={convertToYaml}>JSON → YAML</Button>
            <Button variant="outline" onClick={loadExample}>Load Example</Button>
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
