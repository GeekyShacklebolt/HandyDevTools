import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Plus, Trash2 } from "lucide-react";
import ToolLayout, { ToolInput, ToolOutput } from "@/components/ui/tool-layout";
import { useToolState, clearToolState } from "@/hooks/use-tool-state";

export default function UnixTimeConverter() {
  const [state, setState] = useToolState("unix-time-converter", {
    unixInput: "",
    humanInput: "",
    humanOutput: "",
    unixOutput: "",
    isoOutput: ""
  });

  const { unixInput, humanInput, humanOutput, unixOutput, isoOutput } = state;

  const updateState = (updates: Partial<typeof state>) => {
    setState({ ...state, ...updates });
  };

    const convertFromUnix = () => {
    try {
      const timestamp = parseInt(unixInput);
      if (isNaN(timestamp)) {
        throw new Error("Invalid timestamp");
      }

      const date = new Date(timestamp * 1000);
      updateState({
        humanOutput: date.toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short'
        }),
        unixOutput: timestamp.toString(),
        isoOutput: date.toISOString()
      });
    } catch (error) {
      updateState({
        humanOutput: "Invalid timestamp",
        unixOutput: "",
        isoOutput: ""
      });
    }
  };

    const convertToUnix = () => {
    try {
      const date = new Date(humanInput);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }

      const timestamp = Math.floor(date.getTime() / 1000);
      updateState({
        unixOutput: timestamp.toString(),
        humanOutput: date.toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short'
        }),
        isoOutput: date.toISOString()
      });
    } catch (error) {
      updateState({
        unixOutput: "Invalid date",
        humanOutput: "",
        isoOutput: ""
      });
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    const unixTimestamp = Math.floor(now.getTime() / 1000);

    // Format the date for datetime-local input (YYYY-MM-DDTHH:mm)
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const humanDate = `${year}-${month}-${day}T${hours}:${minutes}`;

    // Update state and immediately convert
    const newState = {
      ...state,
      unixInput: unixTimestamp.toString(),
      humanInput: humanDate
    };

    setState(newState);

    // Convert using the new values directly
    const date = new Date(unixTimestamp * 1000);
    setState({
      ...newState,
      humanOutput: date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      }),
      unixOutput: unixTimestamp.toString(),
      isoOutput: date.toISOString()
    });
  };

  const addTime = (seconds: number) => {
    if (unixInput) {
      const current = parseInt(unixInput);
      if (!isNaN(current)) {
        const newTime = current + seconds;
        const newDate = new Date(newTime * 1000);

        // Format the date for datetime-local input (YYYY-MM-DDTHH:mm)
        const year = newDate.getFullYear();
        const month = String(newDate.getMonth() + 1).padStart(2, '0');
        const day = String(newDate.getDate()).padStart(2, '0');
        const hours = String(newDate.getHours()).padStart(2, '0');
        const minutes = String(newDate.getMinutes()).padStart(2, '0');
        const humanDate = `${year}-${month}-${day}T${hours}:${minutes}`;

        // Update state and immediately convert
        const newState = {
          ...state,
          unixInput: newTime.toString(),
          humanInput: humanDate
        };

        setState(newState);

        // Convert using the new values directly
        setState({
          ...newState,
          humanOutput: newDate.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
          }),
          unixOutput: newTime.toString(),
          isoOutput: newDate.toISOString()
        });
      }
    }
  };

  const clearAll = () => {
    updateState({
      unixInput: "",
      humanInput: "",
      humanOutput: "",
      unixOutput: "",
      isoOutput: ""
    });
  };

  return (
    <ToolLayout
      title="Unix Time Converter"
      description="Convert between Unix timestamps and human-readable dates"
      icon={<Clock className="h-6 w-6 text-blue-500" />}
      outputValue={unixOutput}
      infoContent={
        <p>
          Unix time is the number of seconds since January 1, 1970, 00:00:00 UTC (the Unix epoch).
          It's widely used in programming and systems administration for storing timestamps in a
          standardized format that's independent of timezone.
        </p>
      }
    >
      <ToolInput title="Input">
        <div className="space-y-4">
          <div>
            <Label htmlFor="unix-input">Unix Timestamp</Label>
            <div className="flex space-x-2 mt-1">
              <Input
                id="unix-input"
                type="text"
                placeholder="1672531200"
                value={unixInput}
                onChange={(e) => updateState({ unixInput: e.target.value })}
                className="tool-input"
              />
              <Button onClick={convertFromUnix}>Convert</Button>
            </div>
          </div>

          <div>
            <Label htmlFor="human-input">Human Date</Label>
            <div className="flex space-x-2 mt-1">
              <Input
                id="human-input"
                type="datetime-local"
                value={humanInput}
                onChange={(e) => updateState({ humanInput: e.target.value })}
                className="tool-input"
              />
              <Button onClick={convertToUnix}>Convert</Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button variant="outline" onClick={getCurrentTime}>
              <Clock className="h-4 w-4 mr-1" />
              Current Time
            </Button>
            <Button variant="outline" onClick={() => addTime(3600)}>
              <Plus className="h-4 w-4 mr-1" />
              +1 Hour
            </Button>
            <Button variant="outline" onClick={() => addTime(86400)}>
              <Plus className="h-4 w-4 mr-1" />
              +1 Day
            </Button>
            <Button variant="outline" onClick={() => addTime(604800)}>
              <Plus className="h-4 w-4 mr-1" />
              +1 Week
            </Button>
            <Button variant="outline" onClick={clearAll}>
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </ToolInput>

      <ToolOutput title="Output" value={unixOutput}>
        <div className="space-y-4">
          <div>
            <Label>Human Readable</Label>
            <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1">
              {humanOutput || "No output"}
            </div>
          </div>

          <div>
            <Label>Unix Timestamp</Label>
            <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1">
              {unixOutput || "No output"}
            </div>
          </div>

          <div>
            <Label>ISO 8601</Label>
            <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1">
              {isoOutput || "No output"}
            </div>
          </div>
        </div>
      </ToolOutput>
    </ToolLayout>
  );
}
