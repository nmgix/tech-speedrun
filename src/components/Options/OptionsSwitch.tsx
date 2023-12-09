import classNames from "classnames";
import "./options-switch.scss";
import { useCallback, useRef } from "react";

type OptionsSwitchProps = {
  optionOff: {
    value: string;
    backgroundColor: string;
  };
  optionOn: {
    value: string;
    backgroundColor: string;
  };
  active: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
};

const OptionsSwitch: React.FC<OptionsSwitchProps> =
  // memo(
  ({ onChange, active, optionOff, optionOn, label }) => {
    const offRef = useRef<HTMLDivElement>(null);
    const onRef = useRef<HTMLDivElement>(null);

    const setWidth = useCallback(() => {
      if (active) {
        if (onRef.current) {
          return onRef.current.clientWidth + 1;
        } else return undefined;
      } else {
        if (offRef.current) {
          return offRef.current.clientWidth;
        } else return undefined;
      }
    }, [offRef, onRef, active]);

    return (
      <label className='options-switch__label'>
        {label}
        <div className='options-switch'>
          <div ref={offRef} className='options-switch__option' style={{ backgroundColor: optionOff.backgroundColor }}>
            {optionOff.value}
          </div>
          <div ref={onRef} className='options-switch__option' style={{ backgroundColor: optionOn.backgroundColor }}>
            {optionOn.value}
          </div>
          <div style={{ width: setWidth() }} className={classNames("options-switch__toggle", { "options-switch__toggle--active": active })} />
          <input className='options-switch__input' type='checkbox' checked={active} onChange={onChange} aria-label='toggle buton' />
        </div>
      </label>
    );
  };
//   (prev, next) => {
//     console.log({ prev, next, result: prev.active === next.active });
//     return prev.active === next.active;
//   }
// );

export default OptionsSwitch;
