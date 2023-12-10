import { useHotkeys } from "react-hotkeys-hook";
import { OtherCombinations, SearchCombinations } from "./types/combinations";
import { useEffect, useRef } from "react";
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
import { splitPath } from "./components/Search/functions";
import { formatId } from "./components/LanguagesList/functions";
import KeybindsHelper from "./components/KeybindsHelper";

const App: React.FC = () => {
  const { otherLang } = useEngOnly(1000);
  const languages = useAppSelector(state => state.languages);
  const options = useAppSelector(state => state.options);
  const { setStaticLanguages, toggleSearch, toggleKeybindsHelper, setFocusPath } = useAction();

  // useHotkeys(SearchCombinations.esc, () => setActiveKeybindsHelper(false), { preventDefault: true, enableOnFormTags: true }, [activeKeybindsHelper]);
  useHotkeys(OtherCombinations.keybinds, () => toggleKeybindsHelper(), {}, [options.keybindsHelperActive]);

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

  const listRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!resultRef.current || !listRef.current) return console.error("refs not inited");
    if (options.focus !== null && options.focus.length > 0) {
      const path = splitPath(options.focus);
      let lastElem = [...path].pop();
      if (path.length === 0 || !lastElem) return console.error("path length equals zero");
      lastElem = formatId(lastElem);
      const selector = `#${lastElem}`;
      // сначала поиск в result, потом в обычном
      let element: HTMLButtonElement | null = null;
      const existsInResult = resultRef.current.querySelector(selector) as HTMLButtonElement;
      if (existsInResult) {
        element = existsInResult;
      }
      const existsInList = listRef.current.querySelector(selector) as HTMLButtonElement;
      if (existsInList && !existsInList.classList.contains("badge--selected")) {
        element = existsInList;
      }

      if (element) {
        element.classList.add("badge--focused");
        const elementList = element.closest(".result-list__tech-list")! as HTMLUListElement;
        if (existsInResult) {
          // elementList.style.paddingBottom = `${element.offsetHeight}px`;
          element.style.position = "relative";
        }
        const focusBackground = document.body.querySelector(".focus-bg")!;
        focusBackground.classList.add("focus-bg--active");

        const closeFocus = (e: KeyboardEvent) => {
          e.key === "Escape" && removeFocus();
        };

        const removeFocus = () => {
          if (element) {
            element.classList.remove("badge--focused");
            element.style.position = "";
            element.blur();
            element.removeEventListener("keydown", closeFocus);
          }
          if (existsInResult) elementList.style.paddingBottom = "";
          focusBackground.classList.remove("focus-bg--active");
        };

        element.focus();
        element.onblur = removeFocus;
        element.onclick = removeFocus;
        element.addEventListener("keydown", closeFocus);

        const elemFocusTimeout = setTimeout(() => {
          removeFocus();
          setFocusPath(null);
          clearTimeout(elemFocusTimeout);
        }, 3000);
      } else return console.error("element for focus not found");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.focus]);

  return (
    <main className='home-window'>
      {options.searchActive && languages.static.short && createPortal(<SearchPopup />, document.body)}
      {otherLang && createPortal(<WrongLang />, document.body)}
      {options.keybindsHelperActive && createPortal(<KeybindsHelper />, document.body)}
      <LanguagesList passedRef={listRef} />
      <div className='home-window__right-bar'>
        <LanguagesResult passedRef={resultRef} />
        <Options />
      </div>
    </main>
  );
};

export default App;
