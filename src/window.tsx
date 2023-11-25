import { useHotkeys } from "react-hotkeys-hook";
import { SearchCombinations } from "./types/combinations";
import { useState } from "react";
import { createPortal } from "react-dom";
import SearchPopup from "./components/Search";

import { KeysContext, KeysState } from "./state/keysContext";

const App: React.FC = () => {
  const [activeSearch, setActiveSearch] = useState(false);
  useHotkeys(SearchCombinations.toggleSearch, () => setActiveSearch(v => !v), { preventDefault: true, enableOnFormTags: ["input"] }, [activeSearch]);

  const [fieldActive] = useState<KeysState["fieldActive"]>(null);

  return (
    <KeysContext.Provider value={{ searchActive: activeSearch, fieldActive, updateSearch: setActiveSearch }}>
      <main className='home-window'>{activeSearch && createPortal(<SearchPopup />, document.body)}</main>
    </KeysContext.Provider>
  );
};

export default App;
