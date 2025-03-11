import { useTranslation } from "react-i18next";
import { useState } from "react";
import "../styles/LanguageSwitcher.scss";
import kz from "../assets/kz.svg";
import ru from "../assets/ru.svg";
import us from "../assets/us.svg";

const languages = [
  { code: "kk", label: "Қазақша", flag: kz },
  { code: "ru", label: "Русский", flag: ru },
  { code: "en", label: "English", flag: us },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find((lang) => lang.code === i18n.language);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  return (
    <div className="language-switcher">
      <div className="current-lang" onClick={() => setIsOpen(!isOpen)}>
        <img src={currentLang?.flag} alt={currentLang?.label} className="flag-icon" />
      </div>
      {isOpen && (
        <ul className="dropdown">
          {languages.map((lang) => (
            <li key={lang.code} onClick={() => changeLanguage(lang.code)}>
              <img src={lang.flag} alt={lang.label} className="flag-icon" />
              <span>{lang.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;