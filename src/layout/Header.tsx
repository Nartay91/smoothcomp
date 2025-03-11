import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DropdownMenu from '../components/DropdownMenu';
import LanguageSwitcher from '../components/LanguageSwitcher';
import "../styles/Header.scss";
import logo from "../assets/logo.svg";

const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <img className='logo-header' src={logo} alt="Logo" />
        </Link>
        <div className="right-side-header">
          <div>
            <Link className="event-header" to="/">{t('Events')}</Link>
          </div>
        <nav className="nav">
          <DropdownMenu titleKey="About" type="events" />
          <DropdownMenu titleKey="community" type="community" />
        </nav>
        <div className="auth-buttons">
          <Link to="/signup?mode=login" className="btn login">{t('login')}</Link>
          <Link to="/signup?mode=signup" className="btn signup">{t('signup')}</Link>
        </div>
        <LanguageSwitcher />
      </div>
      </div>
    </header>
  );
};

export default Header;