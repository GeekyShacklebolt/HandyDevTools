import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GitCompare } from "lucide-react";
import ToolLayout, { ToolInput, ToolOutput } from "@/components/ui/tool-layout";

export default function TextDiff() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diffOutput, setDiffOutput] = useState("");

  const compareTexts = () => {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    
    const maxLines = Math.max(lines1.length, lines2.length);
    const diff = [];
    
    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';
      
      if (line1 === line2) {
        diff.push(`  ${line1}`);
      } else {
        if (line1) {
          diff.push(`- ${line1}`);
        }
        if (line2) {
          diff.push(`+ ${line2}`);
        }
      }
    }
    
    setDiffOutput(diff.join('\n'));
  };

  const clearAll = () => {
    setText1("");
    setText2("");
    setDiffOutput("");
  };

  const loadExample = () => {
    setText1(`Hello World
This is line 2
This is line 3
Common line`);
    setText2(`Hello Universe
This is line 2
This is line 3 modified
Common line
New line added`);
  };

  return (
    <ToolLayout
      title="Text Diff Checker"
      description="Compare text with side-by-side diff"
      icon={<GitCompare className="h-6 w-6 text-blue-500" />}
      outputValue={diffOutput}
      infoContent={
        <p>
          Text diff shows the differences between two pieces of text. Lines starting with "-" are removed, 
          lines starting with "+" are added, and lines with no prefix are unchanged.
        </p>
      }
    >
      <ToolInput title="Input">
        <div className="space-y-4">
          <div>
            <Label htmlFor="text1">Original Text</Label>
            <Textarea
              id="text1"
              placeholder="Enter original text"
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              className="tool-textarea"
            />
          </div>
          
          <div>
            <Label htmlFor="text2">Modified Text</Label>
            <Textarea
              id="text2"
              placeholder="Enter modified text"
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              className="tool-textarea"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={compareTexts}>Compare</Button>
            <Button variant="outline" onClick={loadExample}>Load Example</Button>
            <Button variant="outline" onClick={clearAll}>Clear</Button>
          </div>
        </div>
      </ToolInput>

      <ToolOutput title="Output" value={diffOutput}>
        <div className="space-y-4">
          <div>
            <Label>Diff Result</Label>
            <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1 whitespace-pre-wrap max-h-96 overflow-y-auto">
              {diffOutput.split('\n').map((line, index) => (
                <div
                  key={index}
                  className={
                    line.startsWith('- ') ? 'diff-removed' :
                    line.startsWith('+ ') ? 'diff-added' :
                    ''
                  }
                >
                  {line || '\u00A0'}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ToolOutput>
    </ToolLayout>
  );
}
