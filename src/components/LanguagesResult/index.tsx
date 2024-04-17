import FocusWindow from "../FocusWindow";
import { Icon } from "../Icon";

import "./language-result.scss";
import TechBadge from "../LanguagesList/TechBadge";
import { OtherCombinations } from "../../types/combinations";
import { useHotkeys } from "react-hotkeys-hook";
import { useAction, useAppSelector } from "../../redux/hooks";
import { memo } from "react";
import { formatTitle } from "./functions";
import { resultListHeaderTranslates, resultListTechCategoriesTranslates } from "../../types/translates";
import classNames from "classnames";
import { isMobile } from "react-device-detect";

type LanguagesResultProps = {
  passedRef?: React.LegacyRef<HTMLUListElement>;
};

const FancyList: React.FC<LanguagesResultProps> = memo(
  ({ passedRef }) => {
    const languages = useAppSelector(state => state.present.languages);
    const { removeLanguageFromResult } = useAction();
    const options = useAppSelector(state => state.present.options);

    return (
      <ul ref={passedRef} className='result-list'>
        {Object.keys(languages.selectedLanguages).map(c => (
          <li key={c} className='result-list__element result-list__tech-category'>
            <span className='result-list__category-title'>
              {formatTitle(
                resultListTechCategoriesTranslates[options.switches.currentLangEN ? "en" : "ru"][
                  c as keyof (typeof resultListTechCategoriesTranslates)["ru" | "en"]
                ]
              )}
              :
            </span>
            <ul className='result-list__tech-list'>
              {Object.keys(languages.selectedLanguages[c]).map(ce => (
                <li key={ce} className='result-list__element result-list__tech-badge'>
                  <TechBadge
                    characteristic={languages.static.characteristicsList && languages.static.characteristicsList[ce]}
                    techTitle={
                      (languages.static.characteristicsList &&
                        languages.static.characteristicsList[languages.selectedLanguages[c][ce]]?.formattedTitle) ||
                      ce
                    }
                    onClick={removeLanguageFromResult}
                    techPath={[c, ce].join("/")}
                  />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    );
  },
  (prev, next) => {
    return prev.passedRef === next.passedRef;
  }
);
FancyList.displayName = "FancyList";

const RealList: React.FC<{ currentLang: boolean }> = memo(
  ({ currentLang }) => {
    const languages = useAppSelector(state => state.present.languages);
    return (
      <ul className='result-list--real'>
        {Object.keys(languages.selectedLanguages).map(c => (
          <li key={c} className='result-list__element result-list__tech-category--real'>
            <span className='result-list__category-title'>
              &ensp;-{" "}
              {formatTitle(
                resultListTechCategoriesTranslates[currentLang ? "en" : "ru"][c as keyof (typeof resultListTechCategoriesTranslates)["ru" | "en"]]
              )}
              &#10;:
            </span>
            <ul className='result-list__tech-list--real'>
              {Object.keys(languages.selectedLanguages[c]).map(ce => (
                <li key={ce} className='result-list__element'>
                  &ensp;&ensp;&ensp;-{" "}
                  {(languages.static.characteristicsList &&
                    languages.static.characteristicsList[languages.selectedLanguages[c][ce]]?.formattedTitle) ||
                    ce}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    );
  },
  (prev, next) => prev.currentLang === next.currentLang
);
RealList.displayName = "RealList";

const ButtonMemo: React.FC<{ copyCb: () => void; selectId: string }> = memo(
  ({ copyCb }) => {
    return (
      <button className='languages-result__copy' onClick={copyCb}>
        <Icon src='/icons/copy.svg' iconColor='#D8D8D8' />
      </button>
    );
  },
  (prev, next) => prev.selectId === next.selectId
);

const LanguagesResult: React.FC<LanguagesResultProps> = ({ passedRef }) => {
  const languages = useAppSelector(state => state.present.languages);
  const options = useAppSelector(state => state.present.options);

  const formattedList = () => {
    const text: string[] = [];
    Object.keys(languages.selectedLanguages).forEach(category => {
      text.push(
        ` - ${formatTitle(
          resultListTechCategoriesTranslates[options.switches.currentLangEN ? "en" : "ru"][
            category as keyof (typeof resultListTechCategoriesTranslates)["ru" | "en"]
          ]
        )}:`
      );
      Object.keys(languages.selectedLanguages[category]).map(ce => {
        text.push(
          `   - ${
            (languages.static.characteristicsList &&
              languages.static.characteristicsList[languages.selectedLanguages[category][ce]]?.formattedTitle) ||
            ce
          }`
        );
      });
    });
    return text.join("\n");
  };
  const copyText = () => {
    const formattedLangList = formattedList();
    if (formattedLangList.length === 0) {
      return console.log("Нечего копировать!");
    }
    const text = `${resultListHeaderTranslates[options.switches.currentLangEN ? "en" : "ru"]}: \n` + formattedLangList;
    // не работает на мобилке потому что
    // https://stackoverflow.com/a/72679789/14889638
    navigator.clipboard.writeText(text);
    console.log("text copied");
  };

  useHotkeys(OtherCombinations.copy, copyText, { preventDefault: true }, [
    options.switches.currentLangEN,
    languages.selectedLanguages,
    languages.static.characteristicsList
  ]);

  return (
    <div className={classNames("languages-result", { "languages-result--mobile": isMobile })}>
      <div className='languages-result__header'>
        <h3 className='languages-result__title'>ur result</h3>
        <span className='languages-result__subtitle'>might l00k fancy, but only here :&#40;</span>
        <ButtonMemo copyCb={copyText} selectId={languages.selectId} />
      </div>
      <FocusWindow
        compareProp={[
          passedRef !== undefined,
          languages.static.short !== null,
          languages.selectId,
          options.switches.listTypeReal,
          options.switches.currentLangEN
        ]}
        fieldName='result_list'
        externalClassname={classNames("languages-result__list", { "languages-result__list--mobile": isMobile })}>
        <span>{resultListHeaderTranslates[options.switches.currentLangEN ? "en" : "ru"]}:</span>
        {languages.static.short !== null && !options.switches.listTypeReal ? (
          <FancyList passedRef={passedRef} />
        ) : (
          <RealList currentLang={options.switches.currentLangEN} />
        )}
      </FocusWindow>
    </div>
  );
};

export default LanguagesResult;
