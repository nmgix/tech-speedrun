import { useContext, useRef, useState } from "react";
import { SearchCombinations } from "../../types/combinations";

import "./search.scss";
import { useHotkeys } from "react-hotkeys-hook";
import { KeysContext } from "../../state/keysContext";
import { LanguagesContext } from "../../state/langsContext";

const SearchPopup = () => {
  const { updateSearch } = useContext(KeysContext);
  const closePopup = () => updateSearch(false);

  const languages = useContext(LanguagesContext);

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

  const [prediction, setPrediction] = useState<string[] | null>(null);
  const [predictionIndex, setPredictionIndex] = useState<number | null>(null);
  useHotkeys(SearchCombinations.nextChoice, () => rollIndex(true), { preventDefault: true, enableOnFormTags: ["input"] }, [predictionIndex]);
  useHotkeys(SearchCombinations.prevChoice, () => rollIndex(false), { preventDefault: true, enableOnFormTags: ["input"] }, [predictionIndex]);
  const rollIndex = (next: boolean) => {
    const nextIndex =
      (((predictionIndex ? (next ? predictionIndex + 1 : predictionIndex - 1) : 0) % prediction!.length) + prediction!.length) % prediction!.length;
    setPredictionIndex(nextIndex);
  };

  const Input: React.FC = () => {
    const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      const regexp = new RegExp(/^[a-zA-Z0-9/\\.\s]*$/);
      const matches = inputValue.match(regexp);

      if (!matches) return;
      else {
        const resultValue = matches.join("");
        setInput(resultValue);

        const words = resultValue.split("/").map(w => w.trim().toLowerCase());

        const findWordInObj = (obj: object, wti: string) => {
          let index: number | null = null;
          const objHasKey = Object.keys(obj).find((w, wi) => {
            const includes = w.includes(wti);
            if (includes) index = wi;
            return includes;
          });

          // console.log(objHasKey && index !== null, objHasKey, index);

          if (objHasKey && index !== null) {
            console.log("worked", Object.keys(obj), index);
            setPrediction(Object.keys(obj));
            setPredictionIndex(index);
          } else {
            setPrediction(null);
            setPredictionIndex(null);
          }
        };

        if (words.length === 1) {
          findWordInObj(languages, words[0]);
        } else if (words.length === 2) {
          findWordInObj(languages[words[0]], words[1]);
        }

        // type RecoursiveObject = { [x: string]: RecoursiveObject | string };

        // const getNestedProperty = (obj: RecoursiveObject, keys: string[]): string[] | null => {
        //   let indexes: number[] = [];

        //   keys.forEach((k, kindex) => {
        //     const currObj = indexes.length > 0 ? obj[0] : obj; // тут косяк с нестингом

        //     let index: number | null = null;
        //     const objHasKey = Object.keys(currObj).find((w, wi) => {
        //       const includes = w.includes(k);
        //       if (includes) index = wi;
        //       return includes;
        //     });
        //     if (!objHasKey || !index) throw new Error("Слово не найдено");

        //     // это если значение ключа - строка (для подсказок 1-5)
        //     const isValueString = typeof currObj[index] === "string";
        //     const isValueObject = typeof currObj[index] === "object";
        //     if (isValueString && kindex === keys.length - 1)
        //       return () => {
        //         setPredictionIndex(0);
        //       };
        //     // если значение ключа - вложенный объект
        //     else if (isValueObject)
        //       return () => {
        //         indexes.push(index!);
        //       };
        //     else if (kindex === keys.length - 1)
        //       return () => {
        //         indexes = [];
        //       };
        //   });

        //   // костыль
        //   if (indexes.length === 1) {
        //     return Object.keys(obj[indexes[0]]);
        //   } else if (indexes.length === 2) {
        //     return Object.keys((obj[indexes[0]] as RecoursiveObject)[indexes[1]]);
        //   } else {
        //     return null;
        //   }
        // };

        // try {
        //   const neededWord = getNestedProperty(languages, words);
        //   setPrediction(neededWord);
        // } catch (error) {
        //   setPrediction(null);
        // }
      }
    };

    return (
      <div className='search-popup__search-block'>
        <span className='search-popup__ghost-text unselectable '>
          {input.length > 0 ? (
            <>
              <span className='search-popup__ghost-text--current'>{input}</span>
              {prediction !== null && prediction.length > 0 && predictionIndex !== null && (
                <span className='search-popup__ghost-text--prediction'>{prediction[predictionIndex].replace(input, "")}</span>
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
