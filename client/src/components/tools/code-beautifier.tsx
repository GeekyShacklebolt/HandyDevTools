import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2 } from "lucide-react";
import ToolLayout, { ToolInput, ToolOutput } from "@/components/ui/tool-layout";

export default function CodeBeautifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [error, setError] = useState("");

  const beautifyCode = () => {
    try {
      // Simple beautification for demo - in a real app you'd use js-beautify or similar
      let beautified = input;
      
      switch (language) {
        case "javascript":
        case "json":
          beautified = JSON.stringify(JSON.parse(input), null, 2);
          break;
        case "html":
          beautified = formatHTML(input);
          break;
        case "css":
          beautified = formatCSS(input);
          break;
        case "xml":
          beautified = formatXML(input);
          break;
        default:
          beautified = input;
      }
      
      setOutput(beautified);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Beautification failed");
      setOutput("");
    }
  };

  const minifyCode = () => {
    try {
      let minified = input;
      
      switch (language) {
        case "javascript":
        case "json":
          minified = JSON.stringify(JSON.parse(input));
          break;
        case "html":
        case "xml":
          minified = input.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
          break;
        case "css":
          minified = input.replace(/\s+/g, ' ').replace(/;\s+}/g, ';}').replace(/{\s+/g, '{').trim();
          break;
        default:
          minified = input.replace(/\s+/g, ' ').trim();
      }
      
      setOutput(minified);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Minification failed");
      setOutput("");
    }
  };

  const formatHTML = (html: string): string => {
    const tab = '  ';
    let result = '';
    let indent = 0;
    
    html.split(/>\s*</).forEach((element, index) => {
      if (element.match(/^\/\w/)) {
        indent--;
      }
      
      result += `${tab.repeat(indent)}<${element}>${index === 0 ? '' : '\n'}`;
      
      if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith('input')) {
        indent++;
      }
    });
    
    return result.substring(1, result.length - 3);
  };

  const formatCSS = (css: string): string => {
    return css
      .replace(/\{/g, ' {\n  ')
      .replace(/\}/g, '\n}\n')
      .replace(/;/g, ';\n  ')
      .replace(/,/g, ',\n')
      .replace(/\n\s*\n/g, '\n')
      .trim();
  };

  const formatXML = (xml: string): string => {
    const PADDING = ' '.repeat(2);
    const reg = /(>)(<)(\/*)/g;
    let pad = 0;
    
    xml = xml.replace(reg, '$1\r\n$2$3');
    
    return xml.split('\r\n').map((node) => {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/) && pad > 0) {
        pad -= 1;
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
        indent = 1;
      } else {
        indent = 0;
      }
      
      pad += indent;
      return PADDING.repeat(pad - indent) + node;
    }).join('\n');
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const loadExample = () => {
    const examples = {
      javascript: 'function hello(name){if(name){return "Hello, "+name+"!";}else{return "Hello, World!";}}',
      json: '{"name":"John","age":30,"city":"New York","hobbies":["reading","swimming"]}',
      html: '<div><p>Hello World</p><ul><li>Item 1</li><li>Item 2</li></ul></div>',
      css: 'body{margin:0;padding:0;}h1{color:blue;font-size:24px;}',
      xml: '<root><person><name>John</name><age>30</age></person></root>'
    };
    setInput(examples[language as keyof typeof examples] || examples.javascript);
  };

  return (
    <ToolLayout
      title="Code Beautifier/Minifier"
      description="Beautify or minify code (HTML, CSS, JS, etc.)"
      icon={<Wand2 className="h-6 w-6 text-blue-500" />}
      outputValue={output}
      infoContent={
        <p>
          Code beautification formats code with proper indentation and spacing for better readability. 
          Minification removes unnecessary whitespace and formatting to reduce file size.
        </p>
      }
    >
      <ToolInput title="Input">
        <div className="space-y-4">
          <div>
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="code-input">Code</Label>
            <Textarea
              id="code-input"
              placeholder="Enter code to beautify or minify"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="tool-textarea"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={beautifyCode}>Beautify</Button>
            <Button variant="outline" onClick={minifyCode}>Minify</Button>
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
            <Label>Formatted Code</Label>
            <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1 whitespace-pre-wrap max-h-96 overflow-y-auto">
              {output || "No output"}
            </div>
          </div>
        </div>
      </ToolOutput>
    </ToolLayout>
  );
}
