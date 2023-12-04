import { useAction, useAppSelector } from "../../redux/hooks";
import OptionsSwitch from "./OptionsSwitch";

import "./options.scss";

const Options: React.FC = () => {
  const options = useAppSelector(state => state.options);
  const { setSwitch } = useAction();

  return (
    <div className='options'>
      <h3 className='options__title'>OOPTIONS</h3>
      <div className='options__wrapper'>
        <OptionsSwitch
          active={options.switches.currentLangEN}
          onChange={e => setSwitch({ field: "currentLangEN", active: e.target.checked })}
          optionOff={{ value: "ru", backgroundColor: "#ff6767" }}
          optionOn={{ value: "en", backgroundColor: "#6792FF" }}
          label='lang'
        />
        <OptionsSwitch
          active={options.switches.listTypeReal}
          onChange={e => setSwitch({ field: "listTypeReal", active: e.target.checked })}
          optionOff={{ value: "fancy", backgroundColor: "#C6FF7E" }}
          optionOn={{ value: "real", backgroundColor: "#9a7eff" }}
          label='list type'
        />
      </div>
    </div>
  );
};

export default Options;
