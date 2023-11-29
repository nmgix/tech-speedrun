import { useHotkeys } from "react-hotkeys-hook";
import { SearchCombinations } from "./types/combinations";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { KeysContext, KeysState } from "./state/keysContext";
import { LanguagesContext, LanguagesState } from "./state/langsContext";
import { FocusContext, FocusState } from "./state/focusContext";
import { SearchContext, SearchState } from "./state/searchContext";

import SearchPopup from "./components/Search";
import useEngOnly from "./components/WrongLang/useEngOnly";
import WrongLang from "./components/WrongLang";
import LanguagesList from "./components/LanguagesList";
import LanguagesResult from "./components/LanguagesResult";

import "./window.scss";
import "./components/LanguagesList/tech.scss";
import { SelectablesContext } from "./state/selectablesContext";
import { LanguagesShort } from "./types/languages";

const App: React.FC = () => {
  const { otherLang } = useEngOnly(1000);
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
  const [languages, setLanguages] = useState<LanguagesState>({ languagesShort: {}, languagesCharacteristicsList: {} });
  useEffect(() => {
    (async () => {
      const fetchedLanguages = await fetch("languages.json", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      }).then(res => res.json());

      const fetchedLanguagesCharacteristics = await fetch("languages-characteristics.json", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      }).then(res => res.json());

      setLanguages({ languagesShort: fetchedLanguages, languagesCharacteristicsList: fetchedLanguagesCharacteristics });
    })();
  }, []);

  // хук для FocusContext провайдера
  const [activeField, setActiveField] = useState<FocusState["field"]>(null);

  // хук для SearchContext провайдера
  const [searchPath, setSearchPath] = useState<SearchState["path"]>(null);

  const [selectedLanguages, setSelectedLanguages] = useState<LanguagesShort>({
    frontend: { react: "react" },
    others: { typescript: "typescript", vscode: "vscode" }
  });

  return (
    <KeysContext.Provider value={{ searchActive: activeSearch, updateSearch: setActiveSearch }}>
      <FocusContext.Provider value={{ field: activeField, setActiveField }}>
        <LanguagesContext.Provider value={languages}>
          <SelectablesContext.Provider value={{ selectedLanguages, setSelectedLanguages }}>
            <SearchContext.Provider value={{ path: searchPath, setPath: setSearchPath }}>
              <main className='home-window'>
                {activeSearch &&
                  languages.languagesShort &&
                  createPortal(<SearchPopup fieldsToMap={languages.languagesShort} updateOnFileChange={setSearchPath} />, document.body)}
                {otherLang && createPortal(<WrongLang />, document.body)}
                {languages.languagesShort !== null && <LanguagesList />}
                {languages.languagesCharacteristicsList !== null && <LanguagesResult />}
              </main>
            </SearchContext.Provider>
          </SelectablesContext.Provider>
        </LanguagesContext.Provider>
      </FocusContext.Provider>
    </KeysContext.Provider>
  );
};

export default App;
