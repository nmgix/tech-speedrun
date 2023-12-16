import { createPortal } from "react-dom";
import "./wrong-lang.scss";

const WrongLang = () => {
  return (
    <div className='wrong-lang'>
      <h4 className='wrong-lang__title'>EENG only!</h4>
      <p className='wrong-lang__subtitle'>switch system lang</p>
    </div>
  );
};

export const WrongLangListener: React.FC<{ active: boolean }> = ({ active }) => {
  if (!active) return null;
  return createPortal(<WrongLang />, document.body);
};

export default WrongLang;
