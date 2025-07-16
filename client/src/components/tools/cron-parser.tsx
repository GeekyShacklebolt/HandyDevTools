import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import ToolLayout, { ToolInput, ToolOutput } from "@/components/ui/tool-layout";
import { parseCronExpression } from "@/lib/utils/advanced-converters";
import { useToolState } from "@/hooks/use-tool-state";

export default function CronParser() {
  const [state, setState] = useToolState("cron-parser", {
    input: "",
    output: "",
    error: "",
    nextRuns: [] as string[]
  });

  const { input, output, error, nextRuns } = state;

  const updateState = (updates: Partial<typeof state>) => {
    setState({ ...state, ...updates });
  };

    const parseCron = () => {
    try {
      if (!input.trim()) {
        updateState({ error: "Please enter a cron expression" });
        return;
      }

      const description = parseCronExpression(input);

      // Generate next run times (simplified)
      const now = new Date();
      const runs = [];
      for (let i = 0; i < 5; i++) {
        const nextRun = new Date(now.getTime() + (i * 60 * 60 * 1000)); // Simplified: every hour
        runs.push(nextRun.toLocaleString());
      }

      updateState({
        output: description,
        nextRuns: runs,
        error: ""
      });
    } catch (err) {
      updateState({
        error: err instanceof Error ? err.message : "Invalid cron expression",
        output: "",
        nextRuns: []
      });
    }
  };

  const clearAll = () => {
    updateState({
      input: "",
      output: "",
      nextRuns: [],
      error: ""
    });
  };

  const loadExample = (expression: string) => {
    updateState({ input: expression });
  };

  return (
    <ToolLayout
      title="Cron Job Parser"
      description="Parse and explain cron expressions"
      icon={<Clock className="h-6 w-6 text-blue-500" />}
      outputValue={output}
      infoContent={
        <div>
          <p className="mb-4">
            Cron expressions are used to schedule tasks in Unix-like systems. The format is:
          </p>
          <div className="font-mono text-sm bg-muted p-2 rounded mb-4">
            minute hour day-of-month month day-of-week [year]
          </div>
          <p>Each field can contain specific values, ranges, lists, or special characters like * and /.</p>
        </div>
      }
    >
      <ToolInput title="Input">
        <div className="space-y-4">
          <div>
            <Label htmlFor="cron-input">Cron Expression</Label>
            <Input
              id="cron-input"
              placeholder="0 12 * * 1-5"
              value={input}
              onChange={(e) => updateState({ input: e.target.value })}
              className="tool-input"
            />
          </div>

          <div>
            <Label>Common Examples</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadExample("0 12 * * 1-5")}
                className="justify-start text-left"
              >
                <span className="font-mono text-xs">0 12 * * 1-5</span>
                <span className="ml-2 text-xs text-muted-foreground">Weekdays at noon</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadExample("*/15 * * * *")}
                className="justify-start text-left"
              >
                <span className="font-mono text-xs">*/15 * * * *</span>
                <span className="ml-2 text-xs text-muted-foreground">Every 15 minutes</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadExample("0 0 1 * *")}
                className="justify-start text-left"
              >
                <span className="font-mono text-xs">0 0 1 * *</span>
                <span className="ml-2 text-xs text-muted-foreground">First day of month</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadExample("0 2 * * 0")}
                className="justify-start text-left"
              >
                <span className="font-mono text-xs">0 2 * * 0</span>
                <span className="ml-2 text-xs text-muted-foreground">Sundays at 2 AM</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={parseCron}>Parse Expression</Button>
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

          {output && (
            <div>
              <Label>Human Readable Description</Label>
              <div className="p-3 bg-muted rounded-md text-sm mt-1">
                {output}
              </div>
            </div>
          )}

          {nextRuns.length > 0 && (
            <div>
              <Label>Next 5 Run Times (Estimated)</Label>
              <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1">
                {nextRuns.map((run, index) => (
                  <div key={index}>{run}</div>
                ))}
              </div>
            </div>
          )}

          {input && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <h4 className="text-blue-900 dark:text-blue-200 font-medium mb-2">Field Breakdown</h4>
              <div className="text-blue-800 dark:text-blue-300 text-sm font-mono">
                {input.split(' ').map((field, index) => {
                  const labels = ['minute', 'hour', 'day-of-month', 'month', 'day-of-week', 'year'];
                  return (
                    <div key={index}>
                      {labels[index]}: {field}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </ToolOutput>
    </ToolLayout>
  );
}
