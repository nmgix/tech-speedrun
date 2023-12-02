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
import Options from "./components/Options";
import { OptionsContext, OptionsState } from "./state/optionsContext";
import { makeInputPrediction } from "./components/Search/functions";

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
  const addLangToResult = (langPath: string) => {
    // add elem or focus
    const langPathLastWord = langPath
      .split("/")
      .filter(w => w.length > 0)
      .pop();
    setSelectedLanguages(prevLangs => {
      // console.log(langPath, prevLangs);
      const exists = makeInputPrediction(langPath, prevLangs);
      // console.log(exists);
      if (exists && exists.currentPredictionWord === langPathLastWord) {
        console.error("word in list aready");
        return prevLangs;
      } else {
        // тут костыль, но мне лень логику усложнять
        const newLangs = Object.assign({}, prevLangs);
        if (exists) {
          // newLangs[exists.currentPosition[0]][langPathLastWord!] = langPathLastWord;
          return prevLangs;
        } else {
          const path = langPath.split("/");
          newLangs[path[0]] = newLangs[path[0]] || {};
          // @ts-expect-error мне лень логику усложнять
          newLangs[path[0]][langPathLastWord!] = langPathLastWord;
        }
        return newLangs;
      }
    });
  };
  const removeLangFromResult = (langPath: string) => {
    // remove elem or focus
    const langPathLastWord = langPath
      .split("/")
      .filter(w => w.length > 0)
      .pop();

    setSelectedLanguages(prevLangs => {
      const exists = makeInputPrediction(langPath, prevLangs);
      if (!exists) return prevLangs;
      else {
        const newLangs = Object.assign({}, prevLangs);
        const path = langPath.split("/");
        delete newLangs[path[0]][langPathLastWord!];
        if (Object.keys(newLangs[path[0]]).length === 0) delete newLangs[path[0]];
        return newLangs;
      }
    });
  };

  const [currentLangEN, setLangEN] = useState<OptionsState["currentLangEN"]>(true);
  const [listTypeReal, setListTypeReal] = useState<OptionsState["listTypeReal"]>(false);

  return (
    <KeysContext.Provider value={{ searchActive: activeSearch, updateSearch: setActiveSearch }}>
      <FocusContext.Provider value={{ field: activeField, setActiveField }}>
        <OptionsContext.Provider value={{ currentLangEN, setLangEN, listTypeReal, setListTypeReal }}>
          <LanguagesContext.Provider value={languages}>
            <SelectablesContext.Provider
              value={{
                selectedLanguages,
                setSelectedLanguages,
                addLanguageToResult: addLangToResult,
                removeLanguageFromResult: removeLangFromResult
              }}>
              <SearchContext.Provider value={{ path: searchPath, setPath: setSearchPath }}>
                <main className='home-window'>
                  {activeSearch &&
                    languages.languagesShort &&
                    createPortal(<SearchPopup fieldsToMap={languages.languagesShort} updateOnFileChange={setSearchPath} />, document.body)}
                  {otherLang && createPortal(<WrongLang />, document.body)}
                  {languages.languagesShort !== null && <LanguagesList />}
                  <div className='home-window__right-bar'>
                    {languages.languagesCharacteristicsList !== null && <LanguagesResult />}
                    <Options />
                  </div>
                </main>
              </SearchContext.Provider>
            </SelectablesContext.Provider>
          </LanguagesContext.Provider>
        </OptionsContext.Provider>
      </FocusContext.Provider>
    </KeysContext.Provider>
  );
};

export default App;
