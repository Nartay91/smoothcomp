import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useTranslation } from 'react-i18next';
import DropdownMenu from '../components/DropdownMenu';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useAuthStore } from '../store/authStore';
import "../styles/Header.scss";
import logo from "../assets/logo.svg";

const Header = () => {
  const { t } = useTranslation();
  const { token, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout(); 
    setIsProfileMenuOpen(false);
    navigate('/'); 
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <img className="logo-header" src={logo} alt="Logo" />
        </Link>
        <div className="right-side-header">
          <div>
            <Link className="event-header" to="/">
              {t('Events')}
            </Link>
          </div>
          <nav className="nav">
            <DropdownMenu titleKey="About" type="events" />
            <DropdownMenu titleKey="community" type="community" />
            {token ? (
              <div className="profile-dropdown">
                <button
                  className="profile-btn"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  {t('profile')}
                </button>
                {isProfileMenuOpen && (
                  <ul className="profile-menu">
                    <li>
                      <Link to="/profile" onClick={() => setIsProfileMenuOpen(false)}>
                        {t('myProfile')}
                      </Link>
                    </li>
                    <li>
                      <Link to="/profile?tab=settings" onClick={() => setIsProfileMenuOpen(false)}>
                        {t('settings')}
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleLogout}>
                        {t('logout')}
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/signup?mode=login" className="btn login">
                  {t('login')}
                </Link>
                <Link to="/signup?mode=signup" className="btn signup">
                  {t('signup')}
                </Link>
              </div>
            )}
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;