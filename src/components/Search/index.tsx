import { useEffect, useRef, useState } from "react";
import { SearchCombinations } from "../../types/combinations";

import "./search.scss";
import { useHotkeys } from "react-hotkeys-hook";
import { PredictionState } from "./types";
import { makeInputPrediction, nestInObj } from "./functions";

import SearchButton from "./components/SearchButton";
import SearchInput from "./components/SearchInput";
import { useRandomWord, useSearchHotkeys } from "./hooks";
import { useAction, useAppSelector } from "../../redux/hooks";

const SearchPopup = () => {
  const languages = useAppSelector(state => state.languages);
  const { addLanguageToResult, removeLanguageFromResult, setPath } = useAction();

  const [input, setInput] = useState("");
  // базовые кнопки, возможно потом уедут обратно сюда
  useSearchHotkeys(input, addLanguageToResult, removeLanguageFromResult);

  // общий стейт подсказки, какое текущее слово подсказывается, является ли оно строчкой, его местоположение в объекте fieldsToMap
  const [predictionState, setPredictionState] = useState<PredictionState | null>(null);
  useEffect(() => {
    if (predictionState && predictionState.currentPredictionEqualsString === true) setPath(input);
    else setPath(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [predictionState]);

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

    if (
      predictionState &&
      folderPrediction === null &&
      predictionState.currentPredictionWord !==
        input
          .split("/")
          .filter(w => w.length > 0)
          .pop()
    )
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
    languages.static.short
  ]);
  function applySuggest() {
    if (input.length === 0 && folderPrediction !== null && desiredPrediction !== null) {
      const prediction = makeInputPrediction(folderPrediction[desiredPrediction], languages.static.short ?? {});
      if (!prediction) return console.error("no prediction for applying");
      const resultPath = prediction.currentPredictionEqualsString ? folderPrediction[desiredPrediction] : folderPrediction[desiredPrediction] + "/";
      setInput(resultPath);
      setPredictionState(makeInputPrediction(resultPath, languages.static.short ?? {}));
    } else {
      if (predictionState === null) return console.error("predcition = null");
      if (
        !input.endsWith("/") &&
        predictionState!.currentPredictionWord ===
          input
            .split("/")
            .filter(w => w.length > 0)
            .pop()
      )
        return console.error("input doesnt end with / but full prediction word");

      if (
        predictionState.currentPredictionWord !== null &&
        predictionState!.currentPredictionWord !==
          input
            .split("/")
            .filter(w => w.length > 0)
            .pop()
      ) {
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
        predictionState={predictionState}
        folderPrediction={folderPrediction}
        desiredPrediction={desiredPrediction}
      />
      <SearchButton predictionState={predictionState} input={input} fieldsToMap={languages.static.short ?? {}} />
    </div>
  );
};

export default SearchPopup;
