import { makeInputPrediction } from "../functions";
import { PredictionState, TempFieldsNested } from "../types";

type SearchInputProps = {
  setInput: (val: string) => void;
  setPredictionState: (pred: PredictionState | null) => void;
  setDesiredPrediction: (desiredIndex: number | null) => void;
  fieldsToMap: TempFieldsNested;

  shadowPrediction: string | null;

  input: string;
  folderPrediction: string[] | null;
  predictionState: PredictionState | null;
  desiredPrediction: number | null;

  examplePhrase: string;
};

const SearchInput: React.FC<SearchInputProps> = props => {
  const { setInput, setPredictionState, setDesiredPrediction } = props;
  const { input, folderPrediction, predictionState, desiredPrediction, shadowPrediction } = props;
  const { fieldsToMap, examplePhrase } = props;

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    const regexp = new RegExp(/^[a-zA-Z0-9/\\.\s-]*$/);
    const matches = inputValue.match(regexp);

    if (!matches) return;
    else {
      const resultValue = matches.join("").replace(/\/+/g, "/");
      setInput(resultValue);
      const newPrediction = makeInputPrediction(resultValue, fieldsToMap);
      setPredictionState(newPrediction);
      setDesiredPrediction(0);
    }
  };

  return (
    <div className='search-popup__search-block'>
      <span className='search-popup__ghost-text unselectable '>
        {shadowPrediction !== null ? (
          <>
            <span className='search-popup__ghost-text--current'>{input}</span>
            <span className='search-popup__ghost-text--prediction'> (?)</span>
          </>
        ) : input.length > 0 || (folderPrediction !== null && desiredPrediction !== null) ? (
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
          `find in app, e.g. "${examplePhrase}"`
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

export default SearchInput;
