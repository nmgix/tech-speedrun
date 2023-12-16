import { useEffect, useMemo, useRef, useState } from "react";
import { HistoryCombinations, SearchCombinations } from "../../types/combinations";

import "./search.scss";
import { useHotkeys } from "react-hotkeys-hook";
import { PredictionState } from "./types";
import { makeInputPrediction, nestInObj, splitPath } from "./functions";

import SearchButton from "./components/SearchButton";
import SearchInput from "./components/SearchInput";
import { useRandomWord, useSearchHotkeys } from "./hooks";
import { useAction, useAppSelector } from "../../redux/hooks";
import { createPortal } from "react-dom";

const SearchPopup = () => {
  const languages = useAppSelector(state => state.present.languages);
  // const search = useAppSelector(state => state.present.search);
  const { addLanguageToResult, removeLanguageFromResult, setFocusPath, setScope } = useAction();

  // отключение глобального history, ну ctrl+z, ctrl+x
  useEffect(() => {
    setScope({ scope: "main-history", active: false });
    return () => {
      setScope({ scope: "main-history", active: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [input, setInput] = useState("");
  // базовые кнопки, возможно потом уедут обратно сюда
  useSearchHotkeys(input, addLanguageToResult, removeLanguageFromResult, setFocusPath);

  // общий стейт подсказки, какое текущее слово подсказывается, является ли оно строчкой, его местоположение в объекте fieldsToMap
  const [predictionState, setPredictionState] = useState<PredictionState | null>(null);

  // ctrl+z, ctrl+x для search
  const [clipboard, setClipboard] = useState<string[]>([]);
  const undoPathLevel = () => {
    const pathSplit = splitPath(input);
    const lastElem = [...pathSplit].pop();
    if (!lastElem) return console.error("no word for clipboard");
    const toClipBoard: string = lastElem + (input.endsWith("/") ? "/" : "");
    const restOfInput: string = input.replace(new RegExp(toClipBoard + "$"), "");

    if (!toClipBoard) return console.error("no word for clipboard");
    const resultPath = restOfInput;
    setInput(resultPath);
    setClipboard(prevClip => [...prevClip, toClipBoard]);
    setPredictionState(makeInputPrediction(resultPath, languages.static.short ?? {}));
  };
  const redoPathLevel = () => {
    const lastElem = [...clipboard].pop();
    if (!lastElem) return console.error("no word in clipboard");
    const resultPath = input.endsWith("/") ? input + lastElem : [input, lastElem].filter(w => w.length > 0).join("/");
    setInput(resultPath);
    setClipboard(prevClip => prevClip.slice(0, -1));
    setPredictionState(makeInputPrediction(resultPath, languages.static.short ?? {}));
  };
  useHotkeys(
    HistoryCombinations.undo,
    undoPathLevel,
    {
      enableOnFormTags: true,
      enableOnContentEditable: true
    },
    [input, clipboard]
  );
  useHotkeys(
    HistoryCombinations.redo,
    redoPathLevel,
    {
      enableOnFormTags: true,
      enableOnContentEditable: true
    },
    [input, clipboard]
  );

  // shadow prediction
  // искать по началу слова, например vsco -> others/vscode
  // если нажимаешь там когда так подсказывает (будет ставить знак (?) полупрозрачный в конце в типа placeholder), подставляет подсказку в input (как при рабатывании дефолт tab)
  const [shadowPrediction, setShadowPrediction] = useState<string | null>(null);
  const languagesCharacteristicsKeys = useMemo(() => {
    const langKeys = languages.static.characteristicsList !== null ? Object.keys(languages.static.characteristicsList) : null;
    const keys = langKeys ? langKeys.sort((a, b) => a.length - b.length).join(" ") : null;
    return keys;
  }, [languages.static.characteristicsList]);
  useEffect(() => {
    if (shadowPrediction !== null && languagesCharacteristicsKeys === null) return setShadowPrediction(null);
    setShadowPrediction(() => {
      if (input.length === 0 || !languagesCharacteristicsKeys) return null;
      const keys = languagesCharacteristicsKeys;
      const wordIndex = keys.indexOf(input);
      if (wordIndex === -1) return null;
      const endIndex = keys.indexOf(" ", wordIndex);
      const word = keys.substring(wordIndex, endIndex !== -1 ? endIndex : undefined);

      if (!word) return null;
      else {
        try {
          const lang = languages.static.characteristicsList![word];
          return lang.path;
        } catch (error) {
          return null;
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  // индекс элемента из массива подсказок (на одном уровне)
  const [desiredPrediction, setDesiredPrediction] = useState<number | null>(null);
  useEffect(() => {
    if (input.length === 0) setDesiredPrediction(null);
  }, [input]);

  // подсказка после слеша (/)
  const [folderPrediction, setFolderPrediction] = useState<string[] | null>(null);
  const giveOptions = () => {
    if (predictionState === null && input.length > 0) return;
    const obj = nestInObj(languages.static.short ?? {}, !predictionState ? [] : predictionState.currentPosition);
    if (!obj || typeof obj === "string") return setFolderPrediction(null);
    const objKeys = Object.keys(obj);
    setFolderPrediction(objKeys);
  };
  useEffect(() => {
    if (input.endsWith("/") || input.length === 0) giveOptions();
    else setFolderPrediction(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, predictionState]);

  // ⇅ управление в подсказках
  const upActive = useRef<boolean | null>(null);
  useHotkeys(SearchCombinations.arrowUp, () => changePrediction(false), { preventDefault: true, enableOnFormTags: true }, [
    desiredPrediction,
    folderPrediction,
    predictionState,
    languages.static.short,
    upActive.current
  ]);
  useHotkeys(SearchCombinations.arrowDown, () => changePrediction(true), { preventDefault: true, enableOnFormTags: true }, [
    desiredPrediction,
    folderPrediction,
    predictionState,
    languages.static.short,
    upActive.current
  ]);
  function changePrediction(up: boolean) {
    // чтобы не было спама при зажатии кнопки/кнопок arrowUp/arrowDown
    if (upActive.current !== null) return console.log(upActive.current);
    upActive.current = up === true;
    const timer = setTimeout(() => {
      upActive.current = null;
      clearTimeout(timer);
    }, 100);

    if (predictionState && folderPrediction === null && predictionState.currentPredictionWord !== splitPath(input).pop())
      return console.log("word typing active, not selection available");

    const obj = nestInObj(languages.static.short ?? {}, !predictionState ? [] : predictionState.currentPosition);
    if (!obj) return console.log("no object");
    const objKeys = Object.keys(obj);
    if (!objKeys) return console.log("no object keys");

    const nextIndex = desiredPrediction !== null ? desiredPrediction + (up ? 1 : -1) : 0;
    const resultIndex = ((nextIndex % objKeys.length) + objKeys.length) % objKeys.length;

    setDesiredPrediction(resultIndex);
  }

  // принять выбранную подсказку
  useHotkeys(SearchCombinations.tab, applySuggest, { preventDefault: true, enableOnFormTags: true }, [
    input,
    desiredPrediction,
    predictionState,
    folderPrediction,
    languages.static.short,
    shadowPrediction
  ]);
  function applySuggest() {
    if (shadowPrediction !== null) {
      setInput(shadowPrediction);
      setPredictionState(makeInputPrediction(shadowPrediction, languages.static.short ?? {}));
    } else {
      if (input.length === 0 && folderPrediction !== null && desiredPrediction !== null) {
        const prediction = makeInputPrediction(folderPrediction[desiredPrediction], languages.static.short ?? {});
        if (!prediction) return console.error("no prediction for applying");
        const resultPath = prediction.currentPredictionEqualsString ? folderPrediction[desiredPrediction] : folderPrediction[desiredPrediction] + "/";
        setInput(resultPath);
        setPredictionState(makeInputPrediction(resultPath, languages.static.short ?? {}));
      } else {
        if (predictionState === null) return console.error("predcition = null");
        if (!input.endsWith("/") && predictionState!.currentPredictionWord === splitPath(input).pop())
          return console.error("input doesnt end with / but full prediction word");

        if (predictionState.currentPredictionWord !== null && predictionState!.currentPredictionWord !== splitPath(input).pop()) {
          // если слово неполное, но уже начато, например frontend/rea(ct)
          const resultPath = predictionState.currentPredictionEqualsString
            ? [...predictionState.prevWords, predictionState.currentPredictionWord].join("/")
            : [...predictionState.prevWords, predictionState.currentPredictionWord].join("/") + "/";
          setInput(resultPath);
          setPredictionState(makeInputPrediction(resultPath, languages.static.short ?? {}));
        } else if (folderPrediction !== null) {
          // если выбирается папка/объект( с значением = строка )
          let newPath = [input.endsWith("/") ? input.slice(0, -1) : input, folderPrediction[desiredPrediction || 0]].join("/");
          const newPrediction = makeInputPrediction(newPath, languages.static.short ?? {});
          if (!newPrediction) return console.error("new prediction retrieval fail");
          if (newPrediction.currentPredictionEqualsString === false) newPath = newPath + "/";
          setInput(newPath);
          setPredictionState(newPrediction);
        } else {
          return console.error("no options worked");
        }
      }
    }

    setDesiredPrediction(0);
  }

  // рандомное слово для рендера внутри «placeholder» SearchInput'а
  // думаю и так ясно (ó﹏ò｡) почему слово хранится здесь, а не внутри SearchInput
  const examplePhrase = useRandomWord();
  return (
    <div className='search-popup'>
      <SearchInput
        setInput={setInput}
        setPredictionState={setPredictionState}
        setDesiredPrediction={setDesiredPrediction}
        fieldsToMap={languages.static.short ?? {}}
        examplePhrase={examplePhrase}
        input={input}
        shadowPrediction={shadowPrediction}
        predictionState={predictionState}
        folderPrediction={folderPrediction}
        desiredPrediction={desiredPrediction}
      />
      <SearchButton predictionState={predictionState} input={input} fieldsToMap={languages.static.short ?? {}} />
    </div>
  );
};

export const PopupListener: React.FC<{ active: boolean }> = ({ active }) => {
  if (!active) return null;
  return createPortal(<SearchPopup />, document.body);
};

export default SearchPopup;
