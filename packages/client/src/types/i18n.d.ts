// types/i18n.d.ts
import * as i18n from 'react-i18next';

declare module 'react-i18next' {
  export function useTranslation<T, J>(): i18n.UseTranslationResponse<T, J>;
}
