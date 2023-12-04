import classNames from "classnames";
import "./focus-window.scss";
import { useAppSelector } from "../../redux/hooks";

type FocusWindowProps = {
  children: React.ReactNode;
  fieldName: string;
  externalClassname?: string;
};

const FocusWindow: React.FC<FocusWindowProps> = ({ children, fieldName, externalClassname }) => {
  const { focus } = useAppSelector(state => state.options);

  return <div className={classNames("focus-window", { "focus-window--active": fieldName === focus }, externalClassname)}>{children}</div>;
};

export default FocusWindow;
