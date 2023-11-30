import { useContext } from "react";
import { LanguagesContext } from "../../state/langsContext";
import FocusWindow from "../FocusWindow";

import "./language-list.scss";
import TechBadge from "./TechBadge";

const LanguagesList: React.FC = () => {
  const languages = useContext(LanguagesContext);

  return (
    <FocusWindow fieldName='languages_list' externalClassname='languages__list'>
      {languages.languagesShort !== null &&
        Object.keys(languages.languagesShort).map(k => (
          <div key={k} className='languages__wrapper'>
            <h4 className='tech__category'>{k}</h4>
            <FocusWindow fieldName='k' externalClassname='tech__list'>
              {Object.keys(languages.languagesShort![k]).map(sk => (
                <TechBadge
                  characteristic={languages.languagesCharacteristicsList && languages.languagesCharacteristicsList[languages.languagesShort![k][sk]]}
                  techTitle={
                    (languages.languagesCharacteristicsList &&
                      languages.languagesCharacteristicsList[languages.languagesShort![k][sk]].formattedTitle) ||
                    sk
                  }
                  key={sk}
                />
              ))}
            </FocusWindow>
          </div>
        ))}
    </FocusWindow>
  );
};

export default LanguagesList;