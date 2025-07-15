import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import ToolLayout, { ToolInput, ToolOutput } from "@/components/ui/tool-layout";

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [flags, setFlags] = useState({
    global: false,
    ignoreCase: false,
    multiline: false
  });
  const [matches, setMatches] = useState<string[]>([]);
  const [highlightedText, setHighlightedText] = useState("");
  const [error, setError] = useState("");

  const testRegex = () => {
    try {
      if (!pattern) {
        setError("Please enter a regex pattern");
        return;
      }

      let flagString = "";
      if (flags.global) flagString += "g";
      if (flags.ignoreCase) flagString += "i";
      if (flags.multiline) flagString += "m";

      const regex = new RegExp(pattern, flagString);
      const foundMatches = [];
      let match;
      
      if (flags.global) {
        while ((match = regex.exec(testString)) !== null) {
          foundMatches.push(match[0]);
          if (!flags.global) break;
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          foundMatches.push(match[0]);
        }
      }

      setMatches(foundMatches);
      
      // Highlight matches in the text
      if (foundMatches.length > 0) {
        let highlighted = testString;
        foundMatches.forEach(match => {
          highlighted = highlighted.replace(
            new RegExp(match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            `<mark class="regex-match">${match}</mark>`
          );
        });
        setHighlightedText(highlighted);
      } else {
        setHighlightedText(testString);
      }
      
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid regex pattern");
      setMatches([]);
      setHighlightedText("");
    }
  };

  const clearAll = () => {
    setPattern("");
    setTestString("");
    setMatches([]);
    setHighlightedText("");
    setError("");
  };

  const loadExample = () => {
    setPattern("\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b");
    setTestString("Contact us at support@example.com or admin@test.org for assistance.");
    setFlags({ global: true, ignoreCase: true, multiline: false });
  };

  return (
    <ToolLayout
      title="RegExp Tester"
      description="Test regular expressions with highlighting"
      icon={<Search className="h-6 w-6 text-blue-500" />}
      outputValue={matches.join('\n')}
      infoContent={
        <p>
          Regular expressions are patterns used to match character combinations in strings. 
          This tool allows you to test regex patterns against sample text and see the matches highlighted.
        </p>
      }
    >
      <ToolInput title="Input">
        <div className="space-y-4">
          <div>
            <Label htmlFor="pattern">Regex Pattern</Label>
            <Input
              id="pattern"
              placeholder="Enter regex pattern"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="tool-input"
            />
          </div>
          
          <div>
            <Label>Flags</Label>
            <div className="flex space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="global"
                  checked={flags.global}
                  onCheckedChange={(checked) => setFlags({...flags, global: !!checked})}
                />
                <Label htmlFor="global">Global (g)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ignoreCase"
                  checked={flags.ignoreCase}
                  onCheckedChange={(checked) => setFlags({...flags, ignoreCase: !!checked})}
                />
                <Label htmlFor="ignoreCase">Ignore Case (i)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="multiline"
                  checked={flags.multiline}
                  onCheckedChange={(checked) => setFlags({...flags, multiline: !!checked})}
                />
                <Label htmlFor="multiline">Multiline (m)</Label>
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="test-string">Test String</Label>
            <Textarea
              id="test-string"
              placeholder="Enter text to test against"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              className="tool-textarea"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={testRegex}>Test Regex</Button>
            <Button variant="outline" onClick={loadExample}>Load Example</Button>
            <Button variant="outline" onClick={clearAll}>Clear</Button>
          </div>
        </div>
      </ToolInput>

      <ToolOutput title="Output" value={matches.join('\n')}>
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-md">
              {error}
            </div>
          )}
          
          <div>
            <Label>Matches ({matches.length})</Label>
            <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1 max-h-32 overflow-y-auto">
              {matches.length > 0 ? matches.join('\n') : "No matches found"}
            </div>
          </div>
          
          <div>
            <Label>Highlighted Text</Label>
            <div 
              className="p-3 bg-muted rounded-md text-sm mt-1 whitespace-pre-wrap max-h-64 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: highlightedText || testString || "No text to highlight" }}
            />
          </div>
        </div>
      </ToolOutput>
    </ToolLayout>
  );
}
