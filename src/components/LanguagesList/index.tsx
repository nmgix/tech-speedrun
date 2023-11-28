import { useContext } from "react";
import { LanguagesContext } from "../../state/langsContext";
import FocusWindow from "../FocusWindow";

import "./language-list.scss";
import { IconTech } from "../IconTech";
import { LanguageCharacteristic } from "../../types/languages";

const LanguagesList: React.FC = () => {
  const languages = useContext(LanguagesContext);

  const TechBadge: React.FC<{ characteristic: LanguageCharacteristic | null; techTitle: string }> = ({ characteristic, techTitle }) => {
    return (
      <button
        className='badge'
        style={
          characteristic
            ? {
                backgroundColor: characteristic.backgroundColor,
                border: characteristic.borderColor ? `1px solid ${characteristic.borderColor}` : undefined,
                color: characteristic.textColor
              }
            : {}
        }>
        <IconTech src={characteristic?.iconLink || undefined} iconColor={characteristic?.textColor} />
        <span className='badge__title'>{techTitle}</span>
      </button>
    );
  };

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
                  techTitle={sk}
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
