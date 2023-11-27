import { useContext, useEffect, useRef, useState } from "react";
import { SearchCombinations } from "../../types/combinations";

import "./search.scss";
import { useHotkeys } from "react-hotkeys-hook";
import { KeysContext } from "../../state/keysContext";

type TempFieldsNested = { [x: string]: TempFieldsNested | string };

type SearchProps = {
  fieldsToMap: TempFieldsNested;
};

const SearchPopup: React.FC<SearchProps> = ({ fieldsToMap }) => {
  const { updateSearch } = useContext(KeysContext);
  function closePopup() {
    updateSearch(false);
  }

  const [input, setInput] = useState("");

  // фраза для инпута, если внутри инпута - будут ререндеры
  const randomPhrase = () => {
    const words = ["love", "peace", "frontend", "value"];
    return words[Math.floor(Math.random() * words.length)];
  };
  const examplePhrase = useRef(randomPhrase());

  // хэндл закрытия через ESC
  useHotkeys(SearchCombinations.esc, closePopup, { preventDefault: true, enableOnFormTags: ["input"] }, [input]);

  // поиск через Enter
  // показать где находится (в левом или правом списке сделать фокус, поиск через global lists state, наверное)
  useHotkeys(SearchCombinations.search, search, { preventDefault: true, enableOnFormTags: ["input"] }, [input]);
  function search() {
    if (input.length === 0) return closePopup();
    console.log(input + " search");
    return closePopup();
  }

  // добавление через Shift+Enter
  useHotkeys(SearchCombinations.add, add, { preventDefault: true, enableOnFormTags: ["input"] }, [input]);
  function add() {
    if (input.length === 0) return closePopup();
    console.log(input + " add");
    return closePopup();
  }

  // Удаление через Shift|Ctrl+Alt+Enter
  useHotkeys(SearchCombinations.remove, remove, { preventDefault: true, enableOnFormTags: ["input"] }, [input]);
  function remove() {
    if (input.length === 0) return closePopup();
    console.log(input + " remove");
    return closePopup();
  }

  const Button: React.FC = () => {
    const [activeCombination, setActiveCombination] = useState<keyof typeof SearchCombinations | null>(null);

    // слушать shift чтобы отобразить кнопку для добавления элемента
    useHotkeys(SearchCombinations.preAdd, () => setActiveCombination("add"), { preventDefault: false, enableOnFormTags: ["input"] }, [
      input,
      activeCombination
    ]);
    useHotkeys(
      SearchCombinations.preAdd,
      () => setActiveCombination(null),
      { preventDefault: false, enableOnFormTags: ["input"], keyup: true, keydown: false },
      [input, activeCombination]
    );

    // слушать комбинацию shift + alt чтобы отобразить кнопку для удаления элемента
    useHotkeys(
      SearchCombinations.preRemove,
      () => setActiveCombination("remove"),
      { preventDefault: true, enableOnFormTags: ["input"], splitKey: "," },
      [input, activeCombination]
    );
    useHotkeys(
      SearchCombinations.preRemove,
      () => setActiveCombination(null),
      { preventDefault: true, enableOnFormTags: ["input"], keyup: true, keydown: false, splitKey: "," },
      [input, activeCombination]
    );

    if ((predictionState === null || predictionState.currentPredictionEqualsString !== true) && activeCombination === null) {
      return <button className='search-popup__button search-popup__button--add'>~</button>;
    }

    switch (activeCombination) {
      case "add": {
        return (
          <button className='search-popup__button search-popup__button--add' onClick={add}>
            +
          </button>
        );
      }
      case "remove": {
        return (
          <button className='search-popup__button search-popup__button--remove' onClick={remove}>
            -
          </button>
        );
      }
      case "search":
      default: {
        return (
          <button className='search-popup__button search-popup__button--search' onClick={search}>
            <img src='/icons/search-magnify.svg' />
          </button>
        );
      }
    }
  };

  type PredictionState = {
    currentPredictionWord: string | null; // если input(state) не пустой
    prevWords: string[];
    currentPredictionEqualsString: boolean; // если currenPrediction не равен строке, то  в конце добавлять слеш (также как и скобки в самом конце, типо 1/5), если строке, то без слеша
    currentPosition: number[]; //через это свойство можно делать оптимизации и поиск соседей
  };

  const [predictionState, setPredictionState] = useState<PredictionState | null>(null);

  const [folderPrediction, setFolderPrediction] = useState<string[] | null>(null);
  const [desiredPrediction, setDesiredPrediction] = useState<number | null>(null);

  useEffect(() => {
    if (input.length === 0) setDesiredPrediction(null);
  }, [input]);

  const giveOptions = () => {
    if (predictionState === null && input.length > 0) return;
    const obj = nestInObj(fieldsToMap, !predictionState ? [] : predictionState.currentPosition);
    if (!obj || typeof obj === "string") return setFolderPrediction(null);
    const objKeys = Object.keys(obj);
    setFolderPrediction(objKeys);
  };
  useEffect(() => {
    if (input.endsWith("/") || input.length === 0) giveOptions();
    else setFolderPrediction(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, predictionState]);

  const fetchFolderData = (obj: object) => Object.keys(obj);
  const makeInputPrediction = (inpVal: string) => {
    if (inpVal.length === 0) {
      console.error("input value equals 0");
      return null;
    }
    const words = inpVal
      .split("/")
      .map(w => w.trim().toLowerCase())
      .filter(w => w.length > 0);

    const positions: number[] = [];
    let currentObject = fieldsToMap;

    let result: PredictionState | null = null;

    for (let i = 0; i < words.length; i++) {
      const currentLevelWord = words[i];
      const objData = fetchFolderData(currentObject);
      let includedIndex: number | null = null;
      const levelIncludesKey = objData.find((w, wi) => {
        const incl = w.startsWith(currentLevelWord);
        if (incl) includedIndex = wi;
        return incl;
      });
      // если элемент вовсе не найден, то подсказки нет
      if (!levelIncludesKey || includedIndex === null) {
        console.error("word not found");
        break;
      }
      // перед завершением функции (либо выдача найденного, либо некст итерация), добавить текущий индекс в позиции
      positions.push(includedIndex);
      const isValueString = typeof currentObject[levelIncludesKey] === "string";

      // если один из промежуточных совпадает но его значение строка - значит не совпадает
      if (isValueString && i < words.length - 1) {
        console.error("found same word, but it's not final in path");
        break;
      } else if (i === words.length - 1) {
        // костыль, но сойдёт
        let filteredWords = words.filter(w => w !== levelIncludesKey);
        filteredWords = filteredWords.filter(w => !levelIncludesKey.includes(w));

        if (levelIncludesKey === currentLevelWord) {
          result = {
            currentPosition: positions,
            prevWords: filteredWords,
            currentPredictionEqualsString: isValueString,
            currentPredictionWord: null
          } as PredictionState;
          break;
        }

        result = {
          currentPosition: positions,
          prevWords: filteredWords,
          currentPredictionEqualsString: isValueString,
          currentPredictionWord: levelIncludesKey
        } as PredictionState;
        break;
      } else {
        //@ts-expect-error мне лень типы настраивать
        currentObject = currentObject[currentLevelWord] as object;
        continue;
      }
    }

    return result;
  };
  function nestInObj(currObj: object, pos: number[]): object {
    const currObjKeys = Object.keys(currObj);
    if (pos.length === 0) return currObj;
    const key = currObjKeys[pos[0]];
    if (pos.length === 1) {
      return currObj[key as keyof object];
    } else {
      const nextPos = pos.slice(1);
      return nestInObj(currObj[key as keyof object], nextPos);
    }
  }

  const upActive = useRef<boolean | null>(null);
  useHotkeys(SearchCombinations.arrowUp, () => changePrediction(false), { preventDefault: true, enableOnFormTags: true }, [
    desiredPrediction,
    folderPrediction,
    predictionState,
    fieldsToMap,
    upActive.current
  ]);
  useHotkeys(SearchCombinations.arrowDown, () => changePrediction(true), { preventDefault: true, enableOnFormTags: true }, [
    desiredPrediction,
    folderPrediction,
    predictionState,
    fieldsToMap,
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

    const obj = nestInObj(fieldsToMap, !predictionState ? [] : predictionState.currentPosition);
    if (!obj) return console.log("no object");
    const objKeys = Object.keys(obj);
    if (!objKeys) return console.log("no object keys");

    const nextIndex = desiredPrediction !== null ? desiredPrediction + (up ? 1 : -1) : 0;
    const resultIndex = ((nextIndex % objKeys.length) + objKeys.length) % objKeys.length;

    setDesiredPrediction(resultIndex);
  }

  useHotkeys(SearchCombinations.tab, applySuggest, { preventDefault: true, enableOnFormTags: true }, [
    input,
    desiredPrediction,
    predictionState,
    folderPrediction,
    fieldsToMap
  ]);
  function applySuggest() {
    if (input.length === 0 && folderPrediction !== null && desiredPrediction !== null) {
      const prediction = makeInputPrediction(folderPrediction[desiredPrediction]);
      if (!prediction) return console.error("no prediction for applying");
      const resultPath = prediction.currentPredictionEqualsString ? folderPrediction[desiredPrediction] : folderPrediction[desiredPrediction] + "/";
      setInput(resultPath);
      setPredictionState(makeInputPrediction(resultPath));
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
        setPredictionState(makeInputPrediction(resultPath));
      } else if (folderPrediction !== null) {
        // если выбирается папка/объект( с значением = строка )
        let newPath = [input.endsWith("/") ? input.slice(0, -1) : input, folderPrediction[desiredPrediction || 0]].join("/");
        const newPrediction = makeInputPrediction(newPath);
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

  const Input: React.FC = () => {
    const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      const regexp = new RegExp(/^[a-zA-Z0-9/\\.\s]*$/);
      const matches = inputValue.match(regexp);

      if (!matches) return;
      else {
        const resultValue = matches.join("");
        setInput(resultValue);
        const newPrediction = makeInputPrediction(resultValue);
        setPredictionState(newPrediction);
        setDesiredPrediction(0);
      }
    };

    return (
      <div className='search-popup__search-block'>
        <span className='search-popup__ghost-text unselectable '>
          {input.length > 0 || (folderPrediction !== null && desiredPrediction !== null) ? (
            <>
              {input.length > 0 && <span className='search-popup__ghost-text--current'>{input}</span>}
              {predictionState !== null && predictionState.currentPredictionWord && (
                <span className='search-popup__ghost-text--prediction'>
                  {[...predictionState.prevWords, predictionState.currentPredictionWord].join("/").replace(input, "")}
                </span>
              )}
              {predictionState !== null &&
                ((predictionState.currentPredictionEqualsString === false && predictionState.currentPredictionWord === null) ||
                  predictionState.currentPredictionEqualsString === false) &&
                !input.endsWith("/") && <span className='search-popup__ghost-text--prediction'>/</span>}
              {folderPrediction !== null && desiredPrediction !== null && (
                <span className='search-popup__ghost-text--prediction'>
                  {folderPrediction[desiredPrediction]} {`(${desiredPrediction + 1}/${folderPrediction.length})`}
                </span>
              )}
            </>
          ) : (
            `find in app, e.g. "${examplePhrase.current}"`
          )}
        </span>
        <input
          autoFocus
          className='search-popup__input'
          value={input}
          onChange={onInput}
          id='search'
          autoComplete='off'
          // placeholder={`find in app, e.g. "${examplePhrase.current}"`}
        />
      </div>
    );
  };

  return (
    <div className='search-popup'>
      <Input />
      <Button />
    </div>
  );
};

export default SearchPopup;
