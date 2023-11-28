import { useContext } from "react";
import { FocusContext } from "../../state/focusContext";

import classNames from "classnames";
import "./focus-window.scss";

type FocusWindowProps = {
  children: React.ReactNode;
  fieldName: string;
  externalClassname?: string;
};

const FocusWindow: React.FC<FocusWindowProps> = ({ children, fieldName, externalClassname }) => {
  const { field } = useContext(FocusContext);

  return <div className={classNames("focus-window", { "focus-window--active": fieldName === field }, externalClassname)}>{children}</div>;
};

export default FocusWindow;
