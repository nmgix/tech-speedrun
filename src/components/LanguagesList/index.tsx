import FocusWindow from "../FocusWindow";

import "./language-list.scss";
import TechBadge from "./TechBadge";
import { useAction, useAppSelector } from "../../redux/hooks";
// import { useEffect } from "react";

type LanguagesListProps = {
  passedRef?: React.LegacyRef<HTMLDivElement>;
};

const LanguagesList: React.FC<LanguagesListProps> = ({ passedRef }) => {
  const languages = useAppSelector(state => state.languages);
  const { addLanguageToResult } = useAction();

  // useEffect(() => {
  //   console.log("language list render");
  // }, []);

  return (
    <FocusWindow
      compareProp={[languages.selectId, languages.static.short !== null]}
      passedRef={passedRef}
      fieldName='languages_list'
      externalClassname='languages__list'>
      {languages.static.short &&
        Object.keys(languages.static.short).map(k => (
          <div key={k} className='languages__wrapper'>
            <h4 className='tech__category'>{k}</h4>
            <FocusWindow
              compareProp={languages.selectedLanguages[k] && Object.keys(languages.selectedLanguages[k]).join(", ")}
              fieldName={k}
              externalClassname='tech__list'>
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
  );
};

export default LanguagesList;
