import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import "../styles/DropdownMenu.scss";
import down from "../assets/down-arrow.svg"

const DropdownMenu = ({ titleKey, type }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = {
    events: [
      { name: t('upcomingEvents'), path: '/events/upcoming' },
      { name: t('pastEvents'), path: '/events/past' },
      { name: t('yourEvents'), path: '/events/your' },
      { name: t('Features & pricing'), path: '/events/pricing' },
      { name: t('Support'), path: '/events/support' }
    ],
    community: [
      { name: t('academies'), path: '/community/academies' },
      { name: t('affiliations'), path: '/community/affiliations' },
      { name: t('athletes'), path: '/community/athletes' }
    ]
  };

  return (
    <div 
      className="dropdown-menu"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="dropdown-button">{t(titleKey)}<img src={down} alt="" /></button>
      {isOpen && (
        <div className="dropdown-content">
          {menuItems[type].map((item, index) => (
            <p className="dropdown-item" key={index}>
              <Link className="lists-info" to={item.path}>{item.name}</Link>
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;