# Tool State Persistence

This directory contains hooks for persisting tool state across navigation.

## useToolState Hook

The `useToolState` hook provides persistent state management for tools using localStorage.

### Usage

```typescript
import { useToolState } from '@/hooks/use-tool-state';

export default function MyTool() {
  // Initialize state with a unique tool ID and initial values
  const [state, setState] = useToolState("my-tool-id", {
    input: "",
    output: "",
    settings: {
      option1: true,
      option2: "default"
    }
  });

  // Destructure state for easier access
  const { input, output, settings } = state;

  // Update state using a helper function
  const updateState = (updates: Partial<typeof state>) => {
    setState({ ...state, ...updates });
  };

  // Example usage
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateState({ input: e.target.value });
  };

  const clearAll = () => {
    updateState({
      input: "",
      output: "",
      settings: { option1: true, option2: "default" }
    });
  };

  return (
    <div>
      <input
        value={input}
        onChange={handleInputChange}
      />
      <button onClick={clearAll}>Clear</button>
    </div>
  );
}
```

### API

#### useToolState<T>(toolId: string, initialState: T): [T, (value: T) => void]

- **toolId**: Unique identifier for the tool (used as localStorage key prefix)
- **initialState**: Initial state object
- **Returns**: Tuple of [state, setState] similar to useState

#### clearToolState(toolId: string): void

Clears the persisted state for a specific tool.

#### clearAllToolStates(): void

Clears all persisted tool states from localStorage.

### Migration Guide

To migrate an existing tool to use persistent state:

1. **Import the hook**:
   ```typescript
   import { useToolState } from '@/hooks/use-tool-state';
   ```

2. **Replace useState with useToolState**:
   ```typescript
   // Before
   const [input, setInput] = useState("");
   const [output, setOutput] = useState("");

   // After
   const [state, setState] = useToolState("tool-id", {
     input: "",
     output: ""
   });
   const { input, output } = state;
   ```

3. **Create updateState helper**:
   ```typescript
   const updateState = (updates: Partial<typeof state>) => {
     setState({ ...state, ...updates });
   };
   ```

4. **Update all state setters**:
   ```typescript
   // Before
   setInput(newValue);

   // After
   updateState({ input: newValue });
   ```

5. **Update input handlers**:
   ```typescript
   // Before
   onChange={(e) => setInput(e.target.value)}

   // After
   onChange={(e) => updateState({ input: e.target.value })}
   ```

### Benefits

- **Persistent across navigation**: Tool state is preserved when switching between tools
- **Automatic localStorage management**: No manual localStorage calls needed
- **Type-safe**: Full TypeScript support
- **Error handling**: Graceful fallback if localStorage is unavailable
- **Clear buttons work**: Existing clear functionality continues to work

### Storage Format

Tool states are stored in localStorage with keys like:
- `tool-state-unix-time-converter`
- `tool-state-json-formatter`
- etc.

Each tool's state is stored as a JSON string containing the complete state object.
