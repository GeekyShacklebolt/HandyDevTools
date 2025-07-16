import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import ToolLayout, { ToolInput, ToolOutput } from "@/components/ui/tool-layout";
import { analyzeString } from "@/lib/utils/advanced-converters";
import { useToolState } from "@/hooks/use-tool-state";

export default function StringInspector() {
  const [state, setState] = useToolState("string-inspector", {
    input: "",
    analysis: null as any
  });

  const { input, analysis } = state;

  const updateState = (updates: Partial<typeof state>) => {
    setState({ ...state, ...updates });
  };

    const analyze = () => {
    if (!input) {
      updateState({ analysis: null });
      return;
    }

    const result = analyzeString(input);
    updateState({ analysis: result });
  };

  const clearAll = () => {
    updateState({
      input: "",
      analysis: null
    });
  };

  const loadExample = () => {
    const example = `Hello, World!
This is a sample text for analysis.
It contains multiple lines, words, and characters.
Let's see what the inspector reveals!`;
    updateState({ input: example });
  };

  const formatAnalysis = () => {
    if (!analysis) return "";

    return `Characters: ${analysis.characters}
Characters (no spaces): ${analysis.charactersNoSpaces}
Words: ${analysis.words}
Lines: ${analysis.lines}
Paragraphs: ${analysis.paragraphs}
Sentences: ${analysis.sentences}
Average words per sentence: ${analysis.averageWordsPerSentence.toFixed(2)}
Most frequent character: "${analysis.mostFrequentChar}"`;
  };

  return (
    <ToolLayout
      title="String Inspector"
      description="Analyze string properties and characters"
      icon={<Search className="h-6 w-6 text-blue-500" />}
      outputValue={formatAnalysis()}
      infoContent={
        <p>
          String inspector analyzes text to provide detailed statistics including character count,
          word count, line count, and character frequency analysis. Useful for content analysis and writing metrics.
        </p>
      }
    >
      <ToolInput title="Input">
        <div className="space-y-4">
          <div>
            <Label htmlFor="string-input">Text to Analyze</Label>
            <Textarea
              id="string-input"
              placeholder="Enter text to analyze"
              value={input}
              onChange={(e) => {
                const newValue = e.target.value;
                updateState({ input: newValue });
                if (newValue) {
                  const result = analyzeString(newValue);
                  updateState({ analysis: result });
                } else {
                  updateState({ analysis: null });
                }
              }}
              className="tool-textarea"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={analyze}>Analyze</Button>
            <Button variant="outline" onClick={loadExample}>Load Example</Button>
            <Button variant="outline" onClick={clearAll}>Clear</Button>
          </div>
        </div>
      </ToolInput>

      <ToolOutput title="Analysis" value={formatAnalysis()}>
        <div className="space-y-4">
          {analysis && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-muted rounded-md">
                  <div className="text-sm font-medium text-muted-foreground">Characters</div>
                  <div className="text-2xl font-bold">{analysis.characters}</div>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <div className="text-sm font-medium text-muted-foreground">Words</div>
                  <div className="text-2xl font-bold">{analysis.words}</div>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <div className="text-sm font-medium text-muted-foreground">Lines</div>
                  <div className="text-2xl font-bold">{analysis.lines}</div>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <div className="text-sm font-medium text-muted-foreground">Paragraphs</div>
                  <div className="text-2xl font-bold">{analysis.paragraphs}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Detailed Statistics</Label>
                  <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1">
                    Characters (with spaces): {analysis.characters}<br/>
                    Characters (without spaces): {analysis.charactersNoSpaces}<br/>
                    Sentences: {analysis.sentences}<br/>
                    Average words per sentence: {analysis.averageWordsPerSentence.toFixed(2)}<br/>
                    Most frequent character: "{analysis.mostFrequentChar}"
                  </div>
                </div>

                <div>
                  <Label>Character Frequency (Top 10)</Label>
                  <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1 max-h-32 overflow-y-auto">
                    {Object.entries(analysis.charFrequency)
                      .sort(([,a], [,b]) => (b as number) - (a as number))
                      .slice(0, 10)
                      .map(([char, count]) => (
                        <div key={char}>
                          "{char === ' ' ? 'space' : char === '\n' ? '\\n' : char}": {count as number}
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </>
          )}

          {!analysis && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Enter text to see analysis
            </div>
          )}
        </div>
      </ToolOutput>
    </ToolLayout>
  );
}
