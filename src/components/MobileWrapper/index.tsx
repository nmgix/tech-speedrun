import { useAction, useAppSelector } from "../../redux/hooks";
import React from "react";
import { useSwipeable } from "react-swipeable";

type MobileWrapperProps = {
  children: React.ReactElement;
  className: string;
};

export const MobileWrapper: React.FC<MobileWrapperProps> = ({ children, className }) => {
  const options = useAppSelector(state => state.present.options);
  const { setMobileOptions } = useAction();
  const handlers = useSwipeable({
    onSwiped: eventData => {
      const screens = 2;

      switch (eventData.dir) {
        case "Right": {
          const nextIndex = options.mobile.currentScreenIndex - 1 === -1 ? 0 : options.mobile.currentScreenIndex - 1;
          if (options.mobile.currentScreenIndex === nextIndex) return;
          return setMobileOptions({ currentScreenIndex: nextIndex });
        }
        case "Left": {
          const nextIndex = options.mobile.currentScreenIndex + 1 === screens ? screens - 1 : options.mobile.currentScreenIndex + 1;
          if (options.mobile.currentScreenIndex === nextIndex) return;
          return setMobileOptions({
            currentScreenIndex: nextIndex
          });
        }
        default:
          return;
      }
    }
  });

  return (
    <>
      {React.cloneElement(children, {
        style:
          options.mobile.currentScreenIndex > 0 ? { left: `calc((100vw - 40px - 40px) * -${options.mobile.currentScreenIndex})` } : { left: `40px` },
        className,
        ...handlers // ? { left: `calc((100vw - 40px - 40px) + (40 * ${options.mobile.currentScreenIndex - 1}) * -${options.mobile.currentScreenIndex})` }
      })}
      {/* {createPortal(<MobileControls />, document.body)} */}
    </>
  );
};
