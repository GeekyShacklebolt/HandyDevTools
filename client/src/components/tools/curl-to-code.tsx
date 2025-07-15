import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code } from "lucide-react";
import ToolLayout, { ToolInput, ToolOutput } from "@/components/ui/tool-layout";

export default function CurlToCode() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [error, setError] = useState("");

  const convertCurl = () => {
    try {
      if (!input.trim()) {
        setError("Please enter a cURL command");
        return;
      }

      const curlCommand = input.trim();
      
      // Parse cURL command (simplified parsing)
      const urlMatch = curlCommand.match(/curl\s+(?:-[A-Za-z]+\s+)?(?:'([^']+)'|"([^"]+)"|([^\s]+))/);
      const url = urlMatch ? (urlMatch[1] || urlMatch[2] || urlMatch[3]) : "";
      
      const methodMatch = curlCommand.match(/-X\s+(\w+)/i);
      const method = methodMatch ? methodMatch[1].toLowerCase() : "get";
      
      const headersMatches = curlCommand.match(/-H\s+(?:'([^']+)'|"([^"]+)")/g) || [];
      const headers: { [key: string]: string } = {};
      
      headersMatches.forEach(match => {
        const headerMatch = match.match(/-H\s+(?:'([^']+)'|"([^"]+)")/);
        if (headerMatch) {
          const header = headerMatch[1] || headerMatch[2];
          const [key, ...valueParts] = header.split(':');
          headers[key.trim()] = valueParts.join(':').trim();
        }
      });
      
      const dataMatch = curlCommand.match(/-d\s+(?:'([^']+)'|"([^"]+)")/);
      const data = dataMatch ? (dataMatch[1] || dataMatch[2]) : "";
      
      let code = "";
      
      switch (language) {
        case "javascript":
          code = generateJavaScriptCode(url, method, headers, data);
          break;
        case "python":
          code = generatePythonCode(url, method, headers, data);
          break;
        case "php":
          code = generatePHPCode(url, method, headers, data);
          break;
        case "go":
          code = generateGoCode(url, method, headers, data);
          break;
        case "curl":
          code = generateCurlCode(url, method, headers, data);
          break;
        default:
          code = generateJavaScriptCode(url, method, headers, data);
      }
      
      setOutput(code);
      setError("");
    } catch (err) {
      setError("Failed to parse cURL command");
      setOutput("");
    }
  };

  const generateJavaScriptCode = (url: string, method: string, headers: any, data: string): string => {
    const headersStr = Object.keys(headers).length > 0 
      ? JSON.stringify(headers, null, 2) 
      : "{}";
    
    return `fetch('${url}', {
  method: '${method.toUpperCase()}',
  headers: ${headersStr},${data ? `
  body: ${JSON.stringify(data)}` : ''}
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`;
  };

  const generatePythonCode = (url: string, method: string, headers: any, data: string): string => {
    const headersStr = Object.keys(headers).length > 0 
      ? JSON.stringify(headers, null, 2) 
      : "{}";
    
    return `import requests

url = "${url}"
headers = ${headersStr}${data ? `
data = ${JSON.stringify(data)}` : ''}

response = requests.${method}(url, headers=headers${data ? ', data=data' : ''})
print(response.json())`;
  };

  const generatePHPCode = (url: string, method: string, headers: any, data: string): string => {
    const headersArray = Object.entries(headers).map(([key, value]) => `    "${key}: ${value}"`).join(',\n');
    
    return `<?php
$curl = curl_init();

curl_setopt_array($curl, array(
    CURLOPT_URL => "${url}",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => "${method.toUpperCase()}",${headersArray ? `
    CURLOPT_HTTPHEADER => array(
${headersArray}
    ),` : ''}${data ? `
    CURLOPT_POSTFIELDS => ${JSON.stringify(data)},` : ''}
));

$response = curl_exec($curl);
curl_close($curl);

echo $response;
?>`;
  };

  const generateGoCode = (url: string, method: string, headers: any, data: string): string => {
    const headersCode = Object.entries(headers).map(([key, value]) => 
      `    req.Header.Set("${key}", "${value}")`
    ).join('\n');
    
    return `package main

import (
    "fmt"
    "net/http"${data ? `
    "strings"` : ''}
)

func main() {
    url := "${url}"${data ? `
    data := strings.NewReader(${JSON.stringify(data)})
    
    req, err := http.NewRequest("${method.toUpperCase()}", url, data)` : `
    
    req, err := http.NewRequest("${method.toUpperCase()}", url, nil)`}
    if err != nil {
        panic(err)
    }
${headersCode}
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()
    
    fmt.Println(resp.Status)
}`;
  };

  const generateCurlCode = (url: string, method: string, headers: any, data: string): string => {
    const headersStr = Object.entries(headers).map(([key, value]) => 
      `-H "${key}: ${value}"`
    ).join(' ');
    
    return `curl -X ${method.toUpperCase()} "${url}"${headersStr ? ` ${headersStr}` : ''}${data ? ` -d ${JSON.stringify(data)}` : ''}`;
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const loadExample = () => {
    const example = `curl -X POST "https://api.example.com/users" -H "Content-Type: application/json" -H "Authorization: Bearer token123" -d '{"name": "John Doe", "email": "john@example.com"}'`;
    setInput(example);
  };

  return (
    <ToolLayout
      title="cURL to Code Generator"
      description="Convert cURL commands to code"
      icon={<Code className="h-6 w-6 text-blue-500" />}
      outputValue={output}
      infoContent={
        <p>
          cURL to code conversion helps developers translate cURL commands into various programming languages. 
          This is useful for integrating API calls into applications or understanding how to make HTTP requests 
          programmatically.
        </p>
      }
    >
      <ToolInput title="Input">
        <div className="space-y-4">
          <div>
            <Label htmlFor="language">Target Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript (Fetch)</SelectItem>
                <SelectItem value="python">Python (Requests)</SelectItem>
                <SelectItem value="php">PHP (cURL)</SelectItem>
                <SelectItem value="go">Go (net/http)</SelectItem>
                <SelectItem value="curl">cURL (formatted)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="curl-input">cURL Command</Label>
            <Textarea
              id="curl-input"
              placeholder="Enter cURL command"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="tool-textarea"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={convertCurl}>Convert to Code</Button>
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
