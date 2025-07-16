import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileCode, Check, X, Search } from "lucide-react";
import ToolLayout, { ToolInput, ToolOutput } from "@/components/ui/tool-layout";
import { JSONPath } from "jsonpath-plus";
import { useToolState, clearToolState } from "@/hooks/use-tool-state";

export default function JSONFormatter() {
  const [state, setState] = useToolState("json-formatter", {
    input: "",
    output: "",
    isValid: null as boolean | null,
    indentSize: "2",
    jsonPath: "",
    pathResult: "",
    parsedJson: null as any
  });

  const { input, output, isValid, indentSize, jsonPath, pathResult, parsedJson } = state;

  const updateState = (updates: Partial<typeof state>) => {
    setState({ ...state, ...updates });
  };

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, parseInt(indentSize));
      updateState({
        output: formatted,
        isValid: true,
        parsedJson: parsed
      });
    } catch (error) {
      updateState({
        output: `Error: ${error instanceof Error ? error.message : 'Invalid JSON'}`,
        isValid: false,
        parsedJson: null
      });
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      updateState({
        output: minified,
        isValid: true,
        parsedJson: parsed
      });
    } catch (error) {
      updateState({
        output: `Error: ${error instanceof Error ? error.message : 'Invalid JSON'}`,
        isValid: false,
        parsedJson: null
      });
    }
  };

  const validateJSON = () => {
    try {
      const parsed = JSON.parse(input);
      updateState({
        isValid: true,
        output: "✓ Valid JSON",
        parsedJson: parsed
      });
    } catch (error) {
      updateState({
        isValid: false,
        output: `✗ Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`,
        parsedJson: null
      });
    }
  };

  const searchJsonPath = () => {
    if (!parsedJson) {
      updateState({ pathResult: "Please format or validate JSON first" });
      return;
    }

    if (!jsonPath.trim()) {
      updateState({ pathResult: "" });
      return;
    }

    try {
      const result = JSONPath({ path: jsonPath, json: parsedJson });
      if (result.length === 0) {
        updateState({ pathResult: "No matches found" });
      } else {
        updateState({ pathResult: JSON.stringify(result, null, 2) });
      }
    } catch (error) {
      updateState({ pathResult: `JSONPath Error: ${error instanceof Error ? error.message : 'Invalid path'}` });
    }
  };

  // Real-time JSONPath search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (parsedJson && jsonPath.trim()) {
        searchJsonPath();
      } else if (!jsonPath.trim()) {
        updateState({ pathResult: "" });
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [jsonPath, parsedJson]);

  const clearAll = () => {
    updateState({
      input: "",
      output: "",
      isValid: null,
      jsonPath: "",
      pathResult: "",
      parsedJson: null
    });
  };

  const loadExample = () => {
    const example = `{
  "store": {
    "book": [
      {
        "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": 8.95
      },
      {
        "category": "fiction",
        "author": "Evelyn Waugh",
        "title": "Sword of Honour",
        "price": 12.99
      },
      {
        "category": "fiction",
        "author": "Herman Melville",
        "title": "Moby Dick",
        "isbn": "0-553-21311-3",
        "price": 8.99
      }
    ],
    "bicycle": {
      "color": "red",
      "price": 19.95
    }
  }
}`;
    updateState({ input: example });
  };

  return (
    <ToolLayout
      title="JSON Format/Validate"
      description="Format, validate and beautify JSON data"
      icon={<FileCode className="h-6 w-6 text-blue-500" />}
      outputValue={output}
      infoContent={
        <div>
          <p className="mb-3">
            JSON (JavaScript Object Notation) is a lightweight data-interchange format.
            This tool helps you format, validate, and minify JSON data for better readability
            and debugging.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>JSONPath Search:</strong> Use JSONPath expressions to query and extract specific data from your JSON.
            Available after formatting or validating JSON.
          </p>
        </div>
      }
    >
      <ToolInput title="Input">
        <div className="space-y-4">
          <div>
            <Label htmlFor="json-input">JSON Data</Label>
            <Textarea
              id="json-input"
              placeholder='{"name": "John", "age": 30}'
              value={input}
              onChange={(e) => updateState({ input: e.target.value })}
              className="tool-textarea"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="indent-size">Indent Size:</Label>
            <Select value={indentSize} onValueChange={(value) => updateState({ indentSize: value })}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="8">8</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={formatJSON}>Format</Button>
            <Button variant="outline" onClick={minifyJSON}>Minify</Button>
            <Button variant="outline" onClick={validateJSON}>Validate</Button>
            <Button variant="outline" onClick={loadExample}>Load Example</Button>
            <Button variant="outline" onClick={clearAll}>Clear</Button>
          </div>
        </div>
      </ToolInput>

      <ToolOutput title="Output" value={output}>
        <div className="space-y-4">
          {isValid !== null && (
            <div className={`flex items-center space-x-2 p-2 rounded ${
              isValid ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' :
              'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
            }`}>
              {isValid ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              <span className="text-sm font-medium">
                {isValid ? 'Valid JSON' : 'Invalid JSON'}
              </span>
            </div>
          )}

          <div>
            <Label>Formatted JSON</Label>
            <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1 whitespace-pre-wrap max-h-96 overflow-y-auto">
              {output || "No output"}
            </div>
          </div>

          {parsedJson && (
            <div className="border-t pt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="jsonpath-input">JSONPath Search</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      id="jsonpath-input"
                      placeholder="$.store.book[*].author"
                      value={jsonPath}
                      onChange={(e) => updateState({ jsonPath: e.target.value })}
                      className="flex-1"
                    />
                    <Button onClick={searchJsonPath} size="sm" variant="outline">
                      <Search className="h-4 w-4 mr-1" />
                      Search
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Examples: $.store.book[*].title, $.store.bicycle.price, $..author
                  </p>
                </div>

                {pathResult && (
                  <div>
                    <Label>JSONPath Result</Label>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md font-mono text-sm mt-1 whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {pathResult}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </ToolOutput>
    </ToolLayout>
  );
}
