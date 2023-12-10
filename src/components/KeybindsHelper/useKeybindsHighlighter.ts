import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

type Binds = { [keybindName: string]: string };

const useKeybindsHighlighter = (keybinds: Binds) => {
  const getKeys = (keybinds: Binds): string[] => {
    return [...new Set(Object.keys(keybinds).flatMap(k => keybinds[k].split(/[.+]/)))];
  };

  // может какой-нибудь Map был бы лучше для более быстрого поиска
  //   const activeButtons = useRef<Set<string>>(new Set([]));
  const [activeButtons, setActiveButtons] = useState<Set<string>>(new Set([]));

  //   таймаут если например залагала русская раскладка
  //   const timeout = useRef<NodeJS.Timeout>();

  const filterButtons = (keyEvent: KeyboardEvent) => {
    // if (timeout.current) clearTimeout(timeout.current);
    // timeout.current = setTimeout(() => setActiveButtons(new Set([])), 3000);
    let key = keyEvent.key.toLowerCase();
    switch (key) {
      case " ": {
        key = "space";
        break;
      }
      case "control": {
        key = "ctrl";
        break;
      }
    }
    const remove = keyEvent.type === "keyup";
    if (remove) {
      //   activeButtons.current.delete(key);
      setActiveButtons(pr => {
        const newSet = new Set(pr);
        newSet.delete(key);
        return newSet;
      });
      return;
    } else {
      //   activeButtons.current.add(key);
      setActiveButtons(pr => {
        const newSet = new Set(pr);
        newSet.add(key);
        return newSet;
      });
      return;
    }
  };
  useHotkeys(getKeys(keybinds), filterButtons, { keyup: true, keydown: true }, [activeButtons]);

  return activeButtons;
};

export default useKeybindsHighlighter;
