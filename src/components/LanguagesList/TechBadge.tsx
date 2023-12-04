import classNames from "classnames";
import { LanguageCharacteristic } from "../../types/languages";
import { IconTech } from "../IconTech";
import { formatId } from "./functions";
import { splitPath } from "../Search/functions";

type TechBadgeProps = {
  characteristic: LanguageCharacteristic | null;
  techTitle: string;
  onClick: (techPath: string) => void;
  techPath: string;
  selected?: boolean;
};

const TechBadge: React.FC<TechBadgeProps> = ({ characteristic, techTitle, onClick, techPath, selected }) => {
  return (
    <button
      id={formatId(splitPath(techPath).pop()!)}
      className={classNames("badge", { "badge--selected": selected })}
      onClick={() => (!selected ? onClick(techPath) : undefined)}
      tabIndex={selected ? -1 : undefined}
      style={
        characteristic
          ? {
              backgroundColor: characteristic.backgroundColor,
              border: `1px solid ${characteristic.borderColor ? characteristic.borderColor : characteristic.backgroundColor}`,
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
