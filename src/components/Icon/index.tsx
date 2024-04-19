import "./icon.scss";

export type IconProps = {
  src: string;
  iconColor?: string;
};

export const Icon: React.FC<IconProps> = ({ src, iconColor }) => {
  // console.log(process.env.PUBLIC_URL);
  return (
    <i className='icon' style={{ backgroundColor: iconColor, WebkitMask: `url(${src}) 50% 50% / contain no-repeat`, WebkitMaskSize: "contain" }} />
  );
};
