import { useContext } from "react";
import { FieldOptions, FocusContext } from "../../state/focusContext";
import classNames from "classnames";

type FocusWindowProps = {
  children: React.ReactNode;
  fieldName: FieldOptions;
};

const FocusWindow: React.FC<FocusWindowProps> = ({ children, fieldName }) => {
  const { field } = useContext(FocusContext);

  return <div className={classNames("focus-window", { "focus-window--active": fieldName === field })}>{children}</div>;
};

export default FocusWindow;
