import { useContext } from "react";
import OptionsSwitch from "./OptionsSwitch";

import "./options.scss";
import { OptionsContext } from "../../state/optionsContext";

const Options: React.FC = () => {
  const { currentLangEN, listTypeReal, setLangEN, setListTypeReal } = useContext(OptionsContext);

  return (
    <div className='options'>
      <h3 className='options__title'>OOPTIONS</h3>
      <div className='options__wrapper'>
        <OptionsSwitch
          active={currentLangEN}
          onChange={e => setLangEN(e.target.checked)}
          optionOff={{ value: "ru", backgroundColor: "#ff6767" }}
          optionOn={{ value: "en", backgroundColor: "#6792FF" }}
          label='lang'
        />
        <OptionsSwitch
          active={listTypeReal}
          onChange={e => setListTypeReal(e.target.checked)}
          optionOff={{ value: "fancy", backgroundColor: "#C6FF7E" }}
          optionOn={{ value: "real", backgroundColor: "#9a7eff" }}
          label='list type'
        />
      </div>
    </div>
  );
};

export default Options;
