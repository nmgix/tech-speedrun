import { useHotkeys } from "react-hotkeys-hook";
import { SearchCombinations } from "./types/combinations";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import SearchPopup from "./components/Search";

import { KeysContext, KeysState } from "./state/keysContext";
import { LanguagesContext, LanguagesState } from "./state/langsContext";
import { FocusContext, FocusState } from "./state/focusContext";
import { SearchContext, SearchState } from "./state/searchContext";

const App: React.FC = () => {
  // const { enableScope } = useHotkeysContext();

  // хук для KeysContext провайдера
  // хоть и фигурирует слово search, но оно здесь только для ctrl+F
  const [activeSearch, setActiveSearch] = useState<KeysState["searchActive"]>(false);
  useHotkeys(
    SearchCombinations.toggleSearch,
    () => {
      setActiveSearch(v => !v);
      // enableScope("search-active");
    },
    { preventDefault: true, enableOnFormTags: true },
    [activeSearch]
  );

  // хук для LanguagesContext провайдера
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

  // хук для FocusContext провайдера
  const [activeField, setActiveField] = useState<FocusState["field"]>(null);

  // хук для SearchContext провайдера
  const [searchPath, setSearchPath] = useState<SearchState["path"]>(null);
  return (
    <KeysContext.Provider value={{ searchActive: activeSearch, updateSearch: setActiveSearch }}>
      <FocusContext.Provider value={{ field: activeField, setActiveField }}>
        <LanguagesContext.Provider value={languages}>
          <SearchContext.Provider value={{ path: searchPath, setPath: setSearchPath }}>
            <main className='home-window'>
              {activeSearch && createPortal(<SearchPopup fieldsToMap={languages} updateOnFileChange={setSearchPath} />, document.body)}
            </main>
          </SearchContext.Provider>
        </LanguagesContext.Provider>
      </FocusContext.Provider>
    </KeysContext.Provider>
  );
};

export default App;
