import { PredictionState, TempFieldsNested } from "./types";

export function nestInObj(currObj: object, pos: number[]): object | string {
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

export const searchFunctions = {
  search: function search(input: string, closePopup: () => void) {
    if (input.length === 0) return closePopup();
    console.log(input + " search");
    return closePopup();
  },
  add: function add(input: string, closePopup: () => void) {
    if (input.length === 0) return closePopup();
    console.log(input + " add");
    return closePopup();
  },
  remove: function remove(input: string, closePopup: () => void) {
    if (input.length === 0) return closePopup();
    console.log(input + " remove");
    return closePopup();
  }
};

export const fetchFolderData = (obj: object) => Object.keys(obj);

export const makeInputPrediction = (inpVal: string, fieldsToMap: TempFieldsNested) => {
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
