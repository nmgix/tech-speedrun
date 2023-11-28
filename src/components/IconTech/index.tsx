import { useRef } from "react";
import { Icon } from "../Icon";

import "../Icon/icon.scss";

type IconTechProps = {
  src?: string;
  iconColor?: string;
};

export const IconTech: React.FC<IconTechProps> = ({ src, iconColor }) => {
  const fallbackOptions = { min: 1, max: 4 };
  const fallbackRef = useRef<number>(Math.floor(Math.random() * (fallbackOptions.max - fallbackOptions.min + 1) + fallbackOptions.min));
  return src !== undefined ? (
    <Icon src={src} iconColor={iconColor} />
  ) : (
    <Icon src={`/languages-icons/fallback/fallback${fallbackRef.current}.svg`} iconColor='#D9D9D9' />
  );
};
