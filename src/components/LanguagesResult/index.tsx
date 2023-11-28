// import { useContext } from "react";
// // import { LanguagesContext } from "../../state/langsContext";
// import FocusWindow from "../FocusWindow";

import { Icon } from "../Icon";

import "./language-result.scss";

const LanguagesResult: React.FC = () => {
  //   const languages = useContext(LanguagesContext);

  return (
    <div className='languages-result'>
      <div className='languages-result__header'>
        <h3 className='languages-result__title'>ur result</h3>
        <span className='languages-result__subtitle'>might l00k fancy, but only here :&#40;</span>
        <button className='languages-result__copy'>
          <Icon src='/icons/copy.svg' iconColor='#D8D8D8' />
        </button>
      </div>
    </div>
  );
};

export default LanguagesResult;
