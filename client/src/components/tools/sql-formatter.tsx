import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Database } from "lucide-react";
import ToolLayout, { ToolInput, ToolOutput } from "@/components/ui/tool-layout";

export default function SQLFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const formatSQL = () => {
    if (!input.trim()) {
      setOutput("");
      return;
    }

    // Simple SQL formatting - in a real app you'd use a proper SQL formatter library
    let formatted = input
      // Convert to uppercase for keywords
      .replace(/\b(select|from|where|and|or|order by|group by|having|insert|update|delete|create|drop|alter|join|inner join|left join|right join|full join|union|distinct|as|case|when|then|else|end|if|exists|not|in|like|between|is|null|count|sum|avg|max|min|asc|desc)\b/gi, (match) => match.toUpperCase())
      // Add line breaks after major clauses
      .replace(/\s+(FROM|WHERE|AND|OR|ORDER BY|GROUP BY|HAVING|UNION|JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN)\s+/gi, '\n$1 ')
      // Add line breaks after SELECT fields
      .replace(/,\s*(?![^()]*\))/g, ',\n  ')
      // Indent subqueries and lists
      .replace(/\n/g, '\n  ')
      // Fix over-indentation
      .replace(/^\s\s/, '')
      // Clean up extra spaces
      .replace(/\s+/g, ' ')
      .replace(/\(\s+/g, '(')
      .replace(/\s+\)/g, ')')
      .trim();

    setOutput(formatted);
  };

  const minifySQL = () => {
    if (!input.trim()) {
      setOutput("");
      return;
    }

    const minified = input
      .replace(/\s+/g, ' ')
      .replace(/\(\s+/g, '(')
      .replace(/\s+\)/g, ')')
      .replace(/,\s+/g, ',')
      .trim();

    setOutput(minified);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
  };

  const loadExample = () => {
    const example = `select u.id,u.name,u.email,p.title,p.content,p.created_at from users u inner join posts p on u.id=p.user_id where u.active=1 and p.published=1 order by p.created_at desc`;
    setInput(example);
  };

  return (
    <ToolLayout
      title="SQL Formatter"
      description="Format and beautify SQL queries"
      icon={<Database className="h-6 w-6 text-blue-500" />}
      outputValue={output}
      infoContent={
        <p>
          SQL formatting improves query readability by adding proper indentation, line breaks, and spacing. 
          It helps with debugging and maintaining complex SQL queries by making the structure more apparent.
        </p>
      }
    >
      <ToolInput title="Input">
        <div className="space-y-4">
          <div>
            <Label htmlFor="sql-input">SQL Query</Label>
            <Textarea
              id="sql-input"
              placeholder="Enter SQL query to format"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="tool-textarea"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={formatSQL}>Format SQL</Button>
            <Button variant="outline" onClick={minifySQL}>Minify SQL</Button>
            <Button variant="outline" onClick={loadExample}>Load Example</Button>
            <Button variant="outline" onClick={clearAll}>Clear</Button>
          </div>
        </div>
      </ToolInput>

      <ToolOutput title="Output" value={output}>
        <div className="space-y-4">
          <div>
            <Label>Formatted SQL</Label>
            <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1 whitespace-pre-wrap max-h-96 overflow-y-auto">
              {output || "No output"}
            </div>
          </div>
        </div>
      </ToolOutput>
    </ToolLayout>
  );
}
