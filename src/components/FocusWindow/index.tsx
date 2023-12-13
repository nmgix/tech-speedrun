import classNames from "classnames";
import "./focus-window.scss";
import { useAppSelector } from "../../redux/hooks";
import { memo } from "react";

type FocusWindowProps = {
  children: React.ReactNode;
  fieldName: string;
  compareProp: string | boolean | object | null | undefined | (string | boolean | object | null | undefined)[];
  externalClassname?: string;
  extetnalContentClassname?: string;
  passedRef?: React.LegacyRef<HTMLDivElement>;
};

const FocusWindow: React.FC<FocusWindowProps> = memo(
  ({ children, fieldName, externalClassname, extetnalContentClassname, passedRef }) => {
    const { focus } = useAppSelector(state => state.present.options);

    return (
      <div ref={passedRef} className={classNames("focus-window", { "focus-window--active": fieldName === focus }, externalClassname)}>
        <div className='focus-window__border' />
        <div className={classNames("focus-window__content", extetnalContentClassname)}>{children}</div>
      </div>
    );
  },
  (prev, next) => {
    if (Array.isArray(prev.compareProp) && Array.isArray(next.compareProp)) {
      if (prev.compareProp.length === 0 && next.compareProp.length === 0) {
        return true;
      }
      const sameArrayProps =
        (prev.compareProp as string[]).map((p, index) => (next.compareProp as string[])[index] === p).filter(v => v === false).length === 0;
      return sameArrayProps;
    } else if (
      (!Array.isArray(prev.compareProp) && Array.isArray(next.compareProp)) ||
      (Array.isArray(prev.compareProp) && !Array.isArray(next.compareProp))
    ) {
      throw new Error("prev prop is array, next is other type or vica-versa");
    }
    return prev.compareProp === next.compareProp;
  }
);
FocusWindow.displayName = "FocusWindow";
export default FocusWindow;
