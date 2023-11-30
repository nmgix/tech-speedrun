import { useState } from "react";
import OptionsSwitch from "./OptionsSwitch";

import "./options.scss";

const Options: React.FC = () => {
  // TEMPORARY
  const [langEn, setLangEn] = useState<boolean>(true);
  const [listTypeFancy, setListTypeFancy] = useState<boolean>(false);
  // TEMPORARY

  return (
    <div className='options'>
      <h3 className='options__title'>OOPTIONS</h3>
      <div className='options__wrapper'>
        <OptionsSwitch
          active={langEn}
          onChange={e => setLangEn(e.target.checked)}
          optionOff={{ value: "ru", backgroundColor: "#ff6767" }}
          optionOn={{ value: "en", backgroundColor: "#6792FF" }}
          label='lang'
        />
        <OptionsSwitch
          active={listTypeFancy}
          onChange={e => setListTypeFancy(e.target.checked)}
          optionOff={{ value: "fancy", backgroundColor: "#C6FF7E" }}
          optionOn={{ value: "real", backgroundColor: "#9a7eff" }}
          label='list type'
        />
      </div>
    </div>
  );
};

export default Options;
