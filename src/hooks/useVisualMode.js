import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

    const transition = function(newMode, replace = false) {
      if (replace) {
        setMode(newMode);
        const newHistory = [...history]
        newHistory[newHistory.length -1] = newMode;
        setHistory(newHistory);
      } else {
        setMode(newMode);
        const newHistory = [...history, newMode]
        setHistory(newHistory);

      }
    }

    const back = function() {
      const newMode = history[history.length -2]
      if (newMode) {
        setMode(newMode);
        const newHistory = [...history]
        newHistory.pop()
        setHistory(newHistory);
      }
    }
  
  return { mode, transition, back};
}
