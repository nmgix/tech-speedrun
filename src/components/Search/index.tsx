import { useContext, useRef, useState } from "react";
import { SearchCombinations } from "../../types/combinations";

import "./search.scss";
import { useHotkeys } from "react-hotkeys-hook";
import { KeysContext } from "../../state/keysContext";

const SearchPopup = () => {
  const { updateSearch } = useContext(KeysContext);
  const closePopup = () => updateSearch(false);

  const [input, setInput] = useState("");

  useHotkeys(SearchCombinations.esc, closePopup, { preventDefault: true, enableOnFormTags: ["input"] }, [input]);

  useHotkeys(SearchCombinations.search, search, { preventDefault: true, enableOnFormTags: ["input"] }, [input]);
  function search() {
    if (input.length === 0) return closePopup();
    console.log(input + " search");
    return closePopup();
  }

  useHotkeys(SearchCombinations.add, add, { preventDefault: true, enableOnFormTags: ["input"] }, [input]);
  function add() {
    if (input.length === 0) return closePopup();
    console.log(input + " add");
    return closePopup();
  }

  useHotkeys(SearchCombinations.remove, remove, { preventDefault: true, enableOnFormTags: ["input"] }, [input]);
  function remove() {
    if (input.length === 0) return closePopup();
    console.log(input + " remove");
    return closePopup();
  }

  const Button: React.FC = () => {
    const [activeCombination, setActiveCombination] = useState<keyof typeof SearchCombinations | null>(null);

    // слушать shift чтобы отобразить кнопку для добавления элемента
    useHotkeys(SearchCombinations.preAdd, () => setActiveCombination("add"), { preventDefault: true, enableOnFormTags: ["input"] }, [
      input,
      activeCombination
    ]);
    useHotkeys(
      SearchCombinations.preAdd,
      () => setActiveCombination(null),
      { preventDefault: true, enableOnFormTags: ["input"], keyup: true, keydown: false },
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

  const Input: React.FC = () => {
    return (
      <input
        autoFocus
        className='search-popup__input'
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={`find in app, e.g. "${examplePhrase.current}"`}
      />
    );
  };

  const randomPhrase = () => {
    const words = ["love", "peace", "frontend", "value"];
    return words[Math.floor(Math.random() * words.length)];
  };
  const examplePhrase = useRef(randomPhrase());

  return (
    <div className='search-popup'>
      <Input />
      <Button></Button>
    </div>
  );
};

export default SearchPopup;
