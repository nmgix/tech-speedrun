import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ActionCreators as HistoryActionCreators } from "redux-undo";
import { useHotkeys } from "react-hotkeys-hook";
import { isMobile } from "react-device-detect";
import classNames from "classnames";

import "./window.scss";
import "./components/LanguagesList/tech.scss";
import { OtherCombinations, SearchCombinations } from "./types/combinations";

import store from "./redux/store";
import { useAction, useAppSelector, useUndoable } from "./redux/hooks";

import useEngOnly from "./components/WrongLang/useEngOnly";
import LanguagesList from "./components/LanguagesList";
import LanguagesResult from "./components/LanguagesResult";
import Options from "./components/Options";
import { MobileWrapper } from "./components/MobileWrapper/index";

import { splitPath } from "./components/Search/functions";
import { formatId } from "./components/LanguagesList/functions";

import { KeybindsHelperListener } from "./components/KeybindsHelper";
import { PopupListener } from "./components/Search";
import { WrongLangListener } from "./components/WrongLang";

const App: React.FC = () => {
  const { otherLang } = useEngOnly(1000);
  const languages = useAppSelector(state => state.present.languages);
  const options = useAppSelector(state => state.present.options);
  const { setStaticLanguages, toggleSearch, toggleKeybindsHelper, setKeybindsHelper, setFocusPath } = useAction();

  useUndoable();
  useHotkeys(OtherCombinations.esc, () => setKeybindsHelper(false), { preventDefault: true, enableOnFormTags: true }, []);
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
      store.dispatch(HistoryActionCreators.clearHistory());
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const listRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLUListElement>(null);

  // выделение focused технологии по options.focus пути
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
    <MobileWrapper className={classNames("home-window", { "home-window--mobile": isMobile })}>
      <main>
        <PopupListener active={options.searchActive == true && languages.static.short !== null} />
        <WrongLangListener active={otherLang} />
        <KeybindsHelperListener active={options.keybindsHelperActive} />
        <div className='home-window__left-bar'>
          <LanguagesList passedRef={listRef} />
        </div>
        <div className='home-window__right-bar'>
          <LanguagesResult passedRef={resultRef} />
          <Options />
        </div>

        {createPortal(<div className='focus-bg' />, document.body)}
      </main>
    </MobileWrapper>
  );
};

export default App;
