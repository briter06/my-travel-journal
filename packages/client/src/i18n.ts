import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import { environment } from './env/environment';

void i18n
  .use(HttpBackend) // load translations via HTTP
  .use(initReactI18next) // bind react-i18next
  .init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // react already escapes
    },
    backend: {
      loadPath: `${environment.publicUrl}/locales/{{lng}}/translation.json`,
    },
    detection: {
      order: ['path'],
      lookupFromPathIndex: 0,
    },
  });

export default i18n;
