import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Импортируем переводы
import en from './locales/en.json';
import ru from './locales/ru.json';
import kk from './locales/kk.json';

i18n
  .use(initReactI18next) // Подключаем react-i18next
  .use(LanguageDetector) // Автоопределение языка
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      kk: { translation: kk }
    },
    lng: 'kk', // Язык по умолчанию — казахский
    fallbackLng: 'en', // Если нет перевода, используем английский
    interpolation: { escapeValue: false }
  });

export default i18n;
