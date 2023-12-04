import { useHotkeys } from "react-hotkeys-hook";
import { SearchCombinations } from "./types/combinations";
import { useEffect } from "react";
import { createPortal } from "react-dom";

import SearchPopup from "./components/Search";
import useEngOnly from "./components/WrongLang/useEngOnly";
import WrongLang from "./components/WrongLang";
import LanguagesList from "./components/LanguagesList";
import LanguagesResult from "./components/LanguagesResult";

import "./window.scss";
import "./components/LanguagesList/tech.scss";
import Options from "./components/Options";
import { useAction, useAppSelector } from "./redux/hooks";

const App: React.FC = () => {
  const { otherLang } = useEngOnly(1000);
  const languages = useAppSelector(state => state.languages);
  const options = useAppSelector(state => state.options);
  const { setStaticLanguages, toggleSearch } = useAction();

  // хук для KeysContext провайдера
  // хоть и фигурирует слово search, но оно здесь только для ctrl+F
  // const { enableScope } = useHotkeysContext();
  // enableScope("search-active");
  useHotkeys(SearchCombinations.toggleSearch, () => toggleSearch(), { preventDefault: true, enableOnFormTags: true }, [options.searchActive]);

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

      setStaticLanguages({ short: fetchedLanguages, characteristicsList: fetchedLanguagesCharacteristics });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className='home-window'>
      {options.searchActive && languages.static.short && createPortal(<SearchPopup />, document.body)}
      {otherLang && createPortal(<WrongLang />, document.body)}
      <LanguagesList />
      <div className='home-window__right-bar'>
        <LanguagesResult />
        <Options />
      </div>
    </main>
  );
};

export default App;
