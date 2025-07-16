import { useState, useEffect } from 'react';

// Global state to track if we're in a clear operation
let isClearing = false;

export function useToolState<T>(toolId: string, initialState: T): [T, (value: T) => void] {
  const storageKey = `tool-state-${toolId}`;

  // Initialize state from localStorage or use initial state
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : initialState;
    } catch (error) {
      console.warn(`Failed to load state for tool ${toolId}:`, error);
      return initialState;
    }
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    // Don't save if we're in a clear operation
    if (isClearing) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('localStorageChange'));
    } catch (error) {
      console.warn(`Failed to save state for tool ${toolId}:`, error);
    }
  }, [state, storageKey]);

  return [state, setState];
}

// Helper function to clear state for a specific tool
export function clearToolState(toolId: string): void {
  try {
    localStorage.removeItem(`tool-state-${toolId}`);
  } catch (error) {
    console.warn(`Failed to clear state for tool ${toolId}:`, error);
  }
}

// Helper function to clear all tool states
export function clearAllToolStates(): void {
  try {
    isClearing = true;

    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('tool-state-')) {
        localStorage.removeItem(key);
      }
    });

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('localStorageChange'));

    // Reset the clearing flag after a short delay
    setTimeout(() => {
      isClearing = false;
    }, 100);
  } catch (error) {
    console.warn('Failed to clear all tool states:', error);
    isClearing = false;
  }
}

// Helper function to check if any tool states exist with actual user data
export function useHasToolStates(): boolean {
  const [hasStates, setHasStates] = useState(false);

  useEffect(() => {
    const checkForToolStates = () => {
      try {
        const keys = Object.keys(localStorage);
        const toolStateKeys = keys.filter(key => key.startsWith('tool-state-'));

        // Check if any tool state has actual user data (not just default/initial values)
        const hasActualData = toolStateKeys.some(key => {
          try {
            const stored = localStorage.getItem(key);
            if (!stored) return false;

            const state = JSON.parse(stored);

            // Check if the state has meaningful user data
            // Most tools have input/output fields that should be non-empty for user data
            if (state.input && state.input.trim() !== '') return true;
            if (state.output && state.output.trim() !== '') return true;
            if (state.text1 && state.text1.trim() !== '') return true;
            if (state.text2 && state.text2.trim() !== '') return true;
            if (state.base64Output && state.base64Output.trim() !== '') return true;
            if (state.base64Input && state.base64Input.trim() !== '') return true;
            if (state.jwtInput && state.jwtInput.trim() !== '') return true;
            if (state.jsonPath && state.jsonPath.trim() !== '') return true;
            // Unix Time Converter fields
            if (state.unixInput && state.unixInput.trim() !== '') return true;
            if (state.humanInput && state.humanInput.trim() !== '') return true;
            if (state.humanOutput && state.humanOutput.trim() !== '') return true;
            if (state.unixOutput && state.unixOutput.trim() !== '') return true;
            if (state.isoOutput && state.isoOutput.trim() !== '') return true;
            if (state.language && state.language !== 'javascript') return true; // Default is javascript
            if (state.fromBase && state.fromBase !== '10') return true; // Default is 10
            if (state.indentSize && state.indentSize !== '2') return true; // Default is 2
            if (state.className && state.className !== 'User') return true; // Default is User

            // For tools with hashes object
            if (state.hashes && Object.values(state.hashes).some(hash => hash && typeof hash === 'string' && hash.trim() !== '')) return true;

            // For tools with options object
            if (state.options && typeof state.options === 'object') {
              // Check if any non-default options are set
              const defaultOptions = {
                sort: true,
                dedupe: true,
                ascending: true,
                caseSensitive: false,
                removeEmpty: true
              };
              if (JSON.stringify(state.options) !== JSON.stringify(defaultOptions)) return true;
            }

            return false;
          } catch (error) {
            return false;
          }
        });

        setHasStates(hasActualData);
      } catch (error) {
        console.warn('Failed to check tool states:', error);
        setHasStates(false);
      }
    };

    checkForToolStates();

    // Listen for storage events to update when other tabs change localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('tool-state-')) {
        checkForToolStates();
      }
    };

    // Listen for custom events when localStorage changes in the same tab
    const handleCustomStorageChange = () => {
      // Add a small delay to ensure localStorage operations are complete
      setTimeout(checkForToolStates, 10);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleCustomStorageChange);
    };
  }, []);

  return hasStates;
}
