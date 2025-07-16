import { useState, useEffect } from 'react';

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
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
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
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('tool-state-')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Failed to clear all tool states:', error);
  }
}
