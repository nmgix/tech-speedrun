import FocusWindow from "../FocusWindow";

import "./language-list.scss";
import TechBadge from "./TechBadge";
import { useAction, useAppSelector } from "../../redux/hooks";

import { isMobile } from "react-device-detect";
import classNames from "classnames";

type LanguagesListProps = {
  passedRef?: React.LegacyRef<HTMLDivElement>;
};

const LanguagesList: React.FC<LanguagesListProps> = ({ passedRef }) => {
  const languages = useAppSelector(state => state.present.languages);
  const { addLanguageToResult } = useAction();

  return (
    <>
      {isMobile && (
        <div className='languages-result__header'>
          <h3 className='languages-result__title'>langs list</h3>
          {/* <span className='languages-result__subtitle'>might l00k fancy, but only here :&#40;</span> */}
        </div>
      )}
      <FocusWindow
        compareProp={[languages.selectId, languages.static.short !== null]}
        passedRef={passedRef}
        fieldName='languages_list'
        externalClassname={classNames("languages__list", { "languages__list--mobile": isMobile })}
        extetnalContentClassname={"languages__focus-content"}>
        {languages.static.short &&
          Object.keys(languages.static.short).map(k => (
            <div key={k} className='languages__wrapper'>
              <h4 className='tech__category'>{k}</h4>
              <FocusWindow
                compareProp={languages.selectedLanguages[k] && Object.keys(languages.selectedLanguages[k]).join(", ")}
                fieldName={k}
                externalClassname='tech__list'
                extetnalContentClassname={"tech__focus-content"}>
                {Object.keys(languages.static.short![k]).map(sk => (
                  <TechBadge
                    characteristic={languages.static.characteristicsList && languages.static.characteristicsList[languages.static.short![k][sk]]}
                    techTitle={
                      (languages.static.characteristicsList && languages.static.characteristicsList[languages.static.short![k][sk]].formattedTitle) ||
                      sk
                    }
                    key={sk}
                    onClick={addLanguageToResult}
                    techPath={[k, sk].join("/")}
                    selected={languages.selectedLanguages[k] !== undefined && languages.selectedLanguages[k][sk] !== undefined}
                  />
                ))}
              </FocusWindow>
            </div>
          ))}
      </FocusWindow>
    </>
  );
};

export default LanguagesList;
