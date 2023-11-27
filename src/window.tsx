import { useHotkeys } from "react-hotkeys-hook";
import { SearchCombinations } from "./types/combinations";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import SearchPopup from "./components/Search";

import { KeysContext, KeysState } from "./state/keysContext";
import { LanguagesContext, LanguagesState } from "./state/langsContext";

const App: React.FC = () => {
  // const { enableScope } = useHotkeysContext();
  const [languages, setLanguages] = useState<LanguagesState>({});
  useEffect(() => {
    (async () => {
      const fetchedLanguages = await fetch("languages.json", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      }).then(res => res.json());
      setLanguages(fetchedLanguages);
    })();
  }, []);

  const [activeSearch, setActiveSearch] = useState(false);
  useHotkeys(
    SearchCombinations.toggleSearch,
    () => {
      setActiveSearch(v => !v);
      // enableScope("search-active");
    },
    { preventDefault: true, enableOnFormTags: true },
    [activeSearch]
  );

  const [fieldActive] = useState<KeysState["fieldActive"]>(null);

  // https://stackoverflow.com/questions/53346462/react-multiple-contexts
  // второй ответ интересный, но того не стоит
  return (
    <LanguagesContext.Provider value={languages}>
      <KeysContext.Provider value={{ searchActive: activeSearch, fieldActive, updateSearch: setActiveSearch }}>
        <main className='home-window'>{activeSearch && createPortal(<SearchPopup fieldsToMap={languages} />, document.body)}</main>
      </KeysContext.Provider>
    </LanguagesContext.Provider>
  );
};

export default App;
