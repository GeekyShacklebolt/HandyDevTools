import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table } from "lucide-react";
import ToolLayout, { ToolInput, ToolOutput } from "@/components/ui/tool-layout";
import { jsonToCsv, csvToJson } from "@/lib/utils/advanced-converters";

export default function JSONCSVConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convertToCSV = () => {
    try {
      const csv = jsonToCsv(input);
      setOutput(csv);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "JSON to CSV conversion failed");
      setOutput("");
    }
  };

  const convertToJSON = () => {
    try {
      const json = csvToJson(input);
      setOutput(json);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "CSV to JSON conversion failed");
      setOutput("");
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const loadJSONExample = () => {
    const example = `[
  {
    "name": "John Doe",
    "age": 30,
    "city": "New York",
    "email": "john@example.com"
  },
  {
    "name": "Jane Smith",
    "age": 25,
    "city": "Los Angeles",
    "email": "jane@example.com"
  },
  {
    "name": "Bob Johnson",
    "age": 35,
    "city": "Chicago",
    "email": "bob@example.com"
  }
]`;
    setInput(example);
  };

  const loadCSVExample = () => {
    const example = `name,age,city,email
John Doe,30,New York,john@example.com
Jane Smith,25,Los Angeles,jane@example.com
Bob Johnson,35,Chicago,bob@example.com`;
    setInput(example);
  };

  return (
    <ToolLayout
      title="JSON ↔ CSV Converter"
      description="Convert between JSON and CSV formats"
      icon={<Table className="h-6 w-6 text-blue-500" />}
      outputValue={output}
      infoContent={
        <p>
          JSON to CSV conversion transforms JSON arrays into comma-separated values format. 
          CSV to JSON converts tabular data into JSON object arrays. Both formats are commonly used for data exchange.
        </p>
      }
    >
      <ToolInput title="Input">
        <div className="space-y-4">
          <div>
            <Label htmlFor="json-csv-input">JSON Array or CSV Data</Label>
            <Textarea
              id="json-csv-input"
              placeholder="Enter JSON array or CSV data"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="tool-textarea"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={convertToCSV}>JSON → CSV</Button>
            <Button variant="outline" onClick={convertToJSON}>CSV → JSON</Button>
            <Button variant="outline" onClick={loadJSONExample}>Load JSON Example</Button>
            <Button variant="outline" onClick={loadCSVExample}>Load CSV Example</Button>
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
