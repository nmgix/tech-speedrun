import React, { useMemo } from "react";
import { useAppSelector } from "../../redux/hooks";
import { KeybindDescription, keybindsDescriptions, keybindsTitle } from "../../types/translates";

import "./keybinds-helper.scss";
import { allKeybinds } from "../../types/combinations";
import useKeybindsHighlighter from "./useKeybindsHighlighter";
import classNames from "classnames";

const KeybindsHelper = () => {
  const {
    switches: { currentLangEN }
  } = useAppSelector(state => state.options);

  const activeButtons = useKeybindsHighlighter(allKeybinds);

  const [title, keybinds] = useMemo(
    () => [keybindsTitle[currentLangEN ? "en" : "ru"], keybindsDescriptions[currentLangEN ? "en" : "ru"]],
    [currentLangEN]
  );

  const splitCombos = (keybind: string): string[] => {
    const severalCombos = keybind.split(",");
    if (severalCombos.length > 1) return severalCombos;
    else return [keybind];
  };

  const formatKeybind = (keybind: string) => {
    const keybindsSplit = splitCombos(keybind);
    if (keybindsSplit.length === 0) return <></>;
    return keybindsSplit.map((bind, bindIndex, bindArray) => (
      <React.Fragment key={bind}>
        {bind.split("+").map((key, i, arr) => (
          <React.Fragment key={key}>
            <kbd className={classNames({ "bind-active": activeButtons.has(key) })}>{key.trim().toLowerCase()}</kbd>
            {i < arr.length - 1 ? "+" : null}
          </React.Fragment>
        ))}
        {bindIndex < bindArray.length - 1 ? ", " : null}
      </React.Fragment>
    ));
  };

  return (
    <div className='keybinds-helper__wrapper'>
      <div className='keybinds-helper'>
        <div className='keybinds-helper__background' />
        <h3 className='keybinds-helper__title'>{title}</h3>
        <div className='keybinds-helper__list'>
          {Object.keys(keybinds).map(keybind => (
            <li key={keybind} className='keybind'>
              <h4 className='keybind__title'>{(keybinds[keybind as keyof typeof keybinds]! as KeybindDescription).title}</h4>
              <p className='keybind__description'>{(keybinds[keybind as keyof typeof keybinds]! as KeybindDescription).description}</p>
              <samp className='keybind__buttons'>{formatKeybind(allKeybinds[keybind as keyof typeof allKeybinds])}</samp>
            </li>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeybindsHelper;
