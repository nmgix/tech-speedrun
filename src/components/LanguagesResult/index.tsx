import { useContext } from "react";
import { LanguagesContext } from "../../state/langsContext";
// import FocusWindow from "../FocusWindow";

import FocusWindow from "../FocusWindow";
import { Icon } from "../Icon";

import "./language-result.scss";
import TechBadge from "../LanguagesList/TechBadge";
import { SelectablesContext } from "../../state/selectablesContext";
import { OptionsContext } from "../../state/optionsContext";
import { OtherCombinations } from "../../types/combinations";
import { useHotkeys } from "react-hotkeys-hook";

const LanguagesResult: React.FC = () => {
  const languages = useContext(LanguagesContext);
  const { selectedLanguages } = useContext(SelectablesContext);
  const { currentLangEN, listTypeReal } = useContext(OptionsContext);

  const headerTranslates = {
    ru: "Мой технологический стек",
    en: "Here is my tech stack"
  };
  const techCategoriesTranslates = {
    ru: {
      frontend: "фронтенд",
      backend: "бекенд",
      devops: "devops",
      others: "остальное"
    },
    en: {
      frontend: "frontend",
      backend: "backend",
      devops: "devops",
      others: "others"
    }
  };
  const formatTitle = (t: string) => t.slice(0, 1).toUpperCase() + t.slice(1);

  const FancyList = () => {
    return (
      <ul className='result-list'>
        {Object.keys(selectedLanguages).map(c => (
          <li key={c} className='result-list__element result-list__tech-category'>
            <span className='result-list__category-title'>
              {formatTitle(techCategoriesTranslates[currentLangEN ? "en" : "ru"][c as keyof typeof techCategoriesTranslates["ru" | "en"]])}:
            </span>
            <ul className='result-list__tech-list'>
              {Object.keys(selectedLanguages[c]).map(ce => (
                <li key={ce} className='result-list__element result-list__tech-badge'>
                  <TechBadge
                    characteristic={languages.languagesCharacteristicsList && languages.languagesCharacteristicsList[ce]}
                    techTitle={
                      (languages.languagesCharacteristicsList && languages.languagesCharacteristicsList[selectedLanguages[c][ce]]?.formattedTitle) ||
                      ce
                    }
                  />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    );
  };
  const RealList = () => {
    return (
      <ul className='result-list--real'>
        {Object.keys(selectedLanguages).map(c => (
          <li key={c} className='result-list__element result-list__tech-category--real'>
            <span className='result-list__category-title'>
              &ensp;- {formatTitle(techCategoriesTranslates[currentLangEN ? "en" : "ru"][c as keyof typeof techCategoriesTranslates["ru" | "en"]])}
              &#10;:
            </span>
            <ul className='result-list__tech-list--real'>
              {Object.keys(selectedLanguages[c]).map(ce => (
                <li key={ce} className='result-list__element'>
                  &ensp;&ensp;&ensp;-{" "}
                  {(languages.languagesCharacteristicsList && languages.languagesCharacteristicsList[selectedLanguages[c][ce]]?.formattedTitle) || ce}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    );
  };

  const formattedList = () => {
    const text: string[] = [];
    Object.keys(selectedLanguages).forEach(category => {
      text.push(
        ` - ${formatTitle(techCategoriesTranslates[currentLangEN ? "en" : "ru"][category as keyof typeof techCategoriesTranslates["ru" | "en"]])}:`
      );
      Object.keys(selectedLanguages[category]).map(ce => {
        text.push(
          `   - ${
            (languages.languagesCharacteristicsList && languages.languagesCharacteristicsList[selectedLanguages[category][ce]]?.formattedTitle) || ce
          }`
        );
      });
    });
    return text.join("\n");
  };

  const copyText = () => {
    const text = `${headerTranslates[currentLangEN ? "en" : "ru"]}: \n` + formattedList();
    navigator.clipboard.writeText(text);
    console.log("text copied");
  };

  useHotkeys(OtherCombinations.copy, copyText, { preventDefault: true }, [currentLangEN, selectedLanguages, languages.languagesCharacteristicsList]);

  return (
    <div className='languages-result'>
      <div className='languages-result__header'>
        <h3 className='languages-result__title'>ur result</h3>
        <span className='languages-result__subtitle'>might l00k fancy, but only here :&#40;</span>
        <button className='languages-result__copy' onClick={copyText}>
          <Icon src='/icons/copy.svg' iconColor='#D8D8D8' />
        </button>
      </div>
      <FocusWindow fieldName='result_list' externalClassname='languages-result__list'>
        <span>{headerTranslates[currentLangEN ? "en" : "ru"]}:</span>
        {!listTypeReal ? <FancyList /> : <RealList />}
      </FocusWindow>
    </div>
  );
};

export default LanguagesResult;
