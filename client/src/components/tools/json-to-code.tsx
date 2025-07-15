import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Code } from "lucide-react";
import ToolLayout, { ToolInput, ToolOutput } from "@/components/ui/tool-layout";

export default function JSONToCode() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [className, setClassName] = useState("User");
  const [error, setError] = useState("");

  const convertJSON = () => {
    try {
      if (!input.trim()) {
        setError("Please enter JSON data");
        return;
      }

      const jsonData = JSON.parse(input);
      let code = "";

      switch (language) {
        case "typescript":
          code = generateTypeScriptInterface(jsonData, className);
          break;
        case "javascript":
          code = generateJavaScriptClass(jsonData, className);
          break;
        case "python":
          code = generatePythonClass(jsonData, className);
          break;
        case "java":
          code = generateJavaClass(jsonData, className);
          break;
        case "csharp":
          code = generateCSharpClass(jsonData, className);
          break;
        case "go":
          code = generateGoStruct(jsonData, className);
          break;
        default:
          code = generateTypeScriptInterface(jsonData, className);
      }

      setOutput(code);
      setError("");
    } catch (err) {
      setError("Invalid JSON data");
      setOutput("");
    }
  };

  const generateTypeScriptInterface = (data: any, name: string): string => {
    const generateInterface = (obj: any, interfaceName: string): string => {
      if (Array.isArray(obj)) {
        return generateInterface(obj[0], interfaceName);
      }

      let result = `interface ${interfaceName} {\n`;
      
      Object.entries(obj).forEach(([key, value]) => {
        const type = getTypeScriptType(value);
        result += `  ${key}: ${type};\n`;
      });
      
      result += "}";
      return result;
    };

    return generateInterface(data, name);
  };

  const getTypeScriptType = (value: any): string => {
    if (value === null) return "null";
    if (typeof value === "string") return "string";
    if (typeof value === "number") return "number";
    if (typeof value === "boolean") return "boolean";
    if (Array.isArray(value)) {
      if (value.length === 0) return "any[]";
      return `${getTypeScriptType(value[0])}[]`;
    }
    if (typeof value === "object") return "object";
    return "any";
  };

  const generateJavaScriptClass = (data: any, name: string): string => {
    const properties = Object.keys(data).map(key => `    this.${key} = data.${key};`).join('\n');
    
    return `class ${name} {
  constructor(data) {
${properties}
  }
  
  static fromJSON(jsonString) {
    return new ${name}(JSON.parse(jsonString));
  }
  
  toJSON() {
    return JSON.stringify(this);
  }
}`;
  };

  const generatePythonClass = (data: any, name: string): string => {
    const properties = Object.keys(data).map(key => `        self.${key} = data.get('${key}')`).join('\n');
    
    return `class ${name}:
    def __init__(self, data):
${properties}
    
    @classmethod
    def from_json(cls, json_str):
        import json
        return cls(json.loads(json_str))
    
    def to_json(self):
        import json
        return json.dumps(self.__dict__)`;
  };

  const generateJavaClass = (data: any, name: string): string => {
    const fields = Object.entries(data).map(([key, value]) => {
      const type = getJavaType(value);
      return `    private ${type} ${key};`;
    }).join('\n');
    
    const getters = Object.entries(data).map(([key, value]) => {
      const type = getJavaType(value);
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
      return `    public ${type} get${capitalizedKey}() {
        return ${key};
    }`;
    }).join('\n\n');
    
    const setters = Object.entries(data).map(([key, value]) => {
      const type = getJavaType(value);
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
      return `    public void set${capitalizedKey}(${type} ${key}) {
        this.${key} = ${key};
    }`;
    }).join('\n\n');
    
    return `public class ${name} {
${fields}
    
    public ${name}() {}
    
${getters}
    
${setters}
}`;
  };

  const getJavaType = (value: any): string => {
    if (typeof value === "string") return "String";
    if (typeof value === "number") return Number.isInteger(value) ? "int" : "double";
    if (typeof value === "boolean") return "boolean";
    if (Array.isArray(value)) return "List<Object>";
    if (typeof value === "object") return "Object";
    return "Object";
  };

  const generateCSharpClass = (data: any, name: string): string => {
    const properties = Object.entries(data).map(([key, value]) => {
      const type = getCSharpType(value);
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
      return `    public ${type} ${capitalizedKey} { get; set; }`;
    }).join('\n');
    
    return `public class ${name}
{
${properties}
}`;
  };

  const getCSharpType = (value: any): string => {
    if (typeof value === "string") return "string";
    if (typeof value === "number") return Number.isInteger(value) ? "int" : "double";
    if (typeof value === "boolean") return "bool";
    if (Array.isArray(value)) return "List<object>";
    if (typeof value === "object") return "object";
    return "object";
  };

  const generateGoStruct = (data: any, name: string): string => {
    const fields = Object.entries(data).map(([key, value]) => {
      const type = getGoType(value);
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
      return `    ${capitalizedKey} ${type} \`json:"${key}"\``;
    }).join('\n');
    
    return `type ${name} struct {
${fields}
}`;
  };

  const getGoType = (value: any): string => {
    if (typeof value === "string") return "string";
    if (typeof value === "number") return Number.isInteger(value) ? "int" : "float64";
    if (typeof value === "boolean") return "bool";
    if (Array.isArray(value)) return "[]interface{}";
    if (typeof value === "object") return "interface{}";
    return "interface{}";
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const loadExample = () => {
    const example = `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "active": true,
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "zipCode": "12345"
  },
  "hobbies": ["reading", "swimming", "coding"]
}`;
    setInput(example);
  };

  return (
    <ToolLayout
      title="JSON to Code Generator"
      description="Generate code from JSON data"
      icon={<Code className="h-6 w-6 text-blue-500" />}
      outputValue={output}
      infoContent={
        <p>
          JSON to code generation creates data structures (classes, interfaces, structs) from JSON data. 
          This is useful for quickly creating typed data models in various programming languages based on API responses or data schemas.
        </p>
      }
    >
      <ToolInput title="Input">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="language">Target Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="csharp">C#</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="class-name">Class/Interface Name</Label>
              <Input
                id="class-name"
                placeholder="Enter name"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="json-input">JSON Data</Label>
            <Textarea
              id="json-input"
              placeholder="Enter JSON data to generate code from"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="tool-textarea"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={convertJSON}>Generate Code</Button>
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
            <Label>Generated Code ({language})</Label>
            <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1 whitespace-pre-wrap max-h-96 overflow-y-auto">
              {output || "No output"}
            </div>
          </div>
        </div>
      </ToolOutput>
    </ToolLayout>
  );
}
