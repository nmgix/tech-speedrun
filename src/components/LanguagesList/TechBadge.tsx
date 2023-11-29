import { LanguageCharacteristic } from "../../types/languages";
import { IconTech } from "../IconTech";

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

export default TechBadge;
