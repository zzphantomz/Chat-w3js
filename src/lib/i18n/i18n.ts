import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import vi from './vi';

const resources = {
  en: {
    translation: {}
  },
  vi: {
    translation: vi
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });
