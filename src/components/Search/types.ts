import { SearchCombinations } from "../../types/combinations";

export type PredictionState = {
  currentPredictionWord: string | null; // если input(state) не пустой
  prevWords: string[];
  currentPredictionEqualsString: boolean; // если currenPrediction не равен строке, то  в конце добавлять слеш (также как и скобки в самом конце, типо 1/5), если строке, то без слеша
  currentPosition: number[]; //через это свойство можно делать оптимизации и поиск соседей
};

export type TempFieldsNested = { [x: string]: TempFieldsNested | string };

export type ActiveCombination = keyof typeof SearchCombinations | null;
