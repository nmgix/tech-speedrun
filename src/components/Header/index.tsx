import { Icon } from "../Icon";
import "./header.scss";

const Header = () => {
  return (
    <header className='header'>
      <div className='header__top'>
        <h1 className='header__title'>TEECH SPEEDRUUN</h1>
        <span>with &lt;3 by nmgix ;&#41;</span>
      </div>
      <div className='header__helper'>
        <Icon src='icons/question.svg' />
        <span>
          <kbd>CTRL</kbd> + <kbd>SPACE</kbd> for keybinds list
        </span>
      </div>
    </header>
  );
};

export default Header;
