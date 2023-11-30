import "./icon.scss";

export type IconProps = {
  src: string;
  iconColor?: string;
};

export const Icon: React.FC<IconProps> = ({ src, iconColor }) => {
  return (
    <i className='icon' style={{ backgroundColor: iconColor, WebkitMask: `url(${src}) 50% 50% / contain no-repeat`, WebkitMaskSize: "contain" }} />
  );
};
