import { isMobile } from "react-device-detect";
import { Icon } from "../Icon";
import "./header.scss";
import classNames from "classnames";

const Header = () => {
  return (
    <header className='header'>
      <div className='header__top'>
        <h1 className={classNames("header__title", { "header__title--mobile": isMobile })}>TEECH SPEEDRUUN</h1>
        <span className={classNames("header__subtitle", { "header__subtitle--mobile": isMobile })}>with &lt;3 by nmgix ;&#41;</span>
      </div>
      {!isMobile && (
        <div className='header__helper'>
          <Icon src='icons/question.svg' />
          <span>
            <kbd>CTRL</kbd> + <kbd>SPACE</kbd> for keybinds list
          </span>
        </div>
      )}
    </header>
  );
};

export default Header;
