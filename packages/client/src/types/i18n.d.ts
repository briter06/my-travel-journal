// types/i18n.d.ts
import 'react-i18next';

declare module 'react-i18next' {
  export function useTranslation(): {
    t: (key: string) => string;
    i18n: {
      changeLanguage: (lng: string) => Promise<void>;
      language: string | null;
    };
  };
}
