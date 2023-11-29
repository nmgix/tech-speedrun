import { useContext } from "react";
import { LanguagesContext } from "../../state/langsContext";
// import FocusWindow from "../FocusWindow";

import FocusWindow from "../FocusWindow";
import { Icon } from "../Icon";

import "./language-result.scss";
import TechBadge from "../LanguagesList/TechBadge";
import { SelectablesContext } from "../../state/selectablesContext";

const LanguagesResult: React.FC = () => {
  const languages = useContext(LanguagesContext);
  const { selectedLanguages } = useContext(SelectablesContext);

  return (
    <div className='languages-result'>
      <div className='languages-result__header'>
        <h3 className='languages-result__title'>ur result</h3>
        <span className='languages-result__subtitle'>might l00k fancy, but only here :&#40;</span>
        <button className='languages-result__copy'>
          <Icon src='/icons/copy.svg' iconColor='#D8D8D8' />
        </button>
      </div>
      <FocusWindow fieldName='result_list' externalClassname='languages-result__list'>
        <span>Here is my tech stack:</span>
        <ul className='result-list'>
          {Object.keys(selectedLanguages).map(c => (
            <li key={c} className='result-list__element result-list__tech-category'>
              <span className='result-list__category-title'>{c.slice(0, 1).toUpperCase() + c.slice(1)}:</span>
              <ul className='result-list__tech-list'>
                {Object.keys(selectedLanguages[c]).map(ce => (
                  <li key={ce} className='result-list__element result-list__tech-badge'>
                    <TechBadge
                      characteristic={languages.languagesCharacteristicsList && languages.languagesCharacteristicsList[ce]}
                      techTitle={
                        (languages.languagesCharacteristicsList &&
                          languages.languagesCharacteristicsList[selectedLanguages[c][ce]]?.formattedTitle) ||
                        ce
                      }
                    />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </FocusWindow>
    </div>
  );
};

export default LanguagesResult;
