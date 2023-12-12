import { useHotkeys } from "react-hotkeys-hook";
import { OtherCombinations, SearchCombinations } from "../../types/combinations";
import { searchFunctions } from "./functions";
import { useRef } from "react";
import { ActiveCombination } from "./types";
import { useAction } from "../../redux/hooks";

export const useRandomWord = () => {
  const randomPhrase = () => {
    const words = ["love", "peace", "frontend", "value"];
    return words[Math.floor(Math.random() * words.length)];
  };
  const examplePhrase = useRef(randomPhrase());
  return examplePhrase.current;
};

export const useClosePopup = () => {
  const { setSearchState } = useAction();
  function closePopup() {
    setSearchState(false);
  }
  return closePopup;
};

export const useSearchHotkeys = (
  input: string,
  addFunc: (langPath: string) => void,
  removeFunc: (langPath: string) => void,
  setFocusPath: (langPath: string) => void
) => {
  const closePopup = useClosePopup();

  // хэндл закрытия через ESC
  useHotkeys(OtherCombinations.esc, closePopup, { preventDefault: true, enableOnFormTags: ["input"] }, [input]);

  // поиск через Enter
  // показать где находится (в левом или правом списке сделать фокус, поиск через global lists state, наверное)
  useHotkeys(
    SearchCombinations.search,
    () => searchFunctions.search(input, closePopup, setFocusPath),
    { preventDefault: true, enableOnFormTags: ["input"] },
    [input]
  );

  // добавление через Shift+Enter
  useHotkeys(SearchCombinations.add, () => searchFunctions.add(input, closePopup, addFunc), { preventDefault: true, enableOnFormTags: ["input"] }, [
    input
  ]);

  // Удаление через Shift|Ctrl+Alt+Enter
  useHotkeys(
    SearchCombinations.remove,
    () => searchFunctions.remove(input, closePopup, removeFunc),
    { preventDefault: true, enableOnFormTags: ["input"] },
    [input]
  );
};

export const useSearchButtonHotkeys = (input: string, activeCombination: ActiveCombination, setActiveCombination: (c: ActiveCombination) => void) => {
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
};
