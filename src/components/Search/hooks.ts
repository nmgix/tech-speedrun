import { useHotkeys } from "react-hotkeys-hook";
import { SearchCombinations } from "../../types/combinations";
import { searchFunctions } from "./functions";
import { useContext, useRef } from "react";
import { KeysContext } from "../../state/keysContext";
import { ActiveCombination } from "./types";

export const useRandomWord = () => {
  const randomPhrase = () => {
    const words = ["love", "peace", "frontend", "value"];
    return words[Math.floor(Math.random() * words.length)];
  };
  const examplePhrase = useRef(randomPhrase());
  return examplePhrase.current;
};

export const useClosePopup = () => {
  const { updateSearch } = useContext(KeysContext);
  function closePopup() {
    updateSearch(false);
  }
  return closePopup;
};

export const useSearchHotkeys = (input: string) => {
  const closePopup = useClosePopup();

  // хэндл закрытия через ESC
  useHotkeys(SearchCombinations.esc, closePopup, { preventDefault: true, enableOnFormTags: ["input"] }, [input]);

  // поиск через Enter
  // показать где находится (в левом или правом списке сделать фокус, поиск через global lists state, наверное)
  useHotkeys(SearchCombinations.search, () => searchFunctions.search(input, closePopup), { preventDefault: true, enableOnFormTags: ["input"] }, [
    input
  ]);

  // добавление через Shift+Enter
  useHotkeys(SearchCombinations.add, () => searchFunctions.add(input, closePopup), { preventDefault: true, enableOnFormTags: ["input"] }, [input]);

  // Удаление через Shift|Ctrl+Alt+Enter
  useHotkeys(SearchCombinations.remove, () => searchFunctions.remove(input, closePopup), { preventDefault: true, enableOnFormTags: ["input"] }, [
    input
  ]);
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
