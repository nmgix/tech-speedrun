import { useState } from "react";
import { nestInObj, searchFunctions } from "../functions";
import { ActiveCombination, PredictionState, TempFieldsNested } from "../types";
import { useClosePopup, useSearchButtonHotkeys } from "../hooks";
import { useAction } from "../../../redux/hooks";

type SearchButtonProps = {
  input: string;
  predictionState: PredictionState | null;
  fieldsToMap: TempFieldsNested;
};

const SearchButton: React.FC<SearchButtonProps> = ({ input, predictionState, fieldsToMap }) => {
  const [activeCombination, setActiveCombination] = useState<ActiveCombination>(null);
  const closePopup = useClosePopup();
  const { addLanguageToResult, removeLanguageFromResult, setFocusPath } = useAction();
  useSearchButtonHotkeys(input, activeCombination, setActiveCombination);

  if (
    predictionState === null ||
    predictionState.currentPredictionEqualsString !== true ||
    nestInObj(fieldsToMap, predictionState?.currentPosition || []) !==
      input
        .split("/")
        .filter(w => w.length > 0)
        .pop()
  ) {
    return <button className='search-popup__button search-popup__button--add'>~</button>;
  }

  switch (activeCombination) {
    case "add": {
      return (
        <button
          className='search-popup__button search-popup__button--add'
          onClick={() => searchFunctions.add(input, closePopup, addLanguageToResult)}>
          +
        </button>
      );
    }
    case "remove": {
      return (
        <button
          className='search-popup__button search-popup__button--remove'
          onClick={() => searchFunctions.remove(input, closePopup, removeLanguageFromResult)}>
          -
        </button>
      );
    }
    case "search":
    default: {
      return (
        <button className='search-popup__button search-popup__button--search' onClick={() => searchFunctions.search(input, closePopup, setFocusPath)}>
          <img src={`${import.meta.env.BASE_URL}/icons/search-magnify.svg`} />
        </button>
      );
    }
  }
};

export default SearchButton;
