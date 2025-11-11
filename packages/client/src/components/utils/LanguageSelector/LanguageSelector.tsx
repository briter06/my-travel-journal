import { useState } from 'react';
import { useTranslation, UseTranslationResponse } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../../../utils/languages';
import { useLocation, useNavigate } from 'react-router';
import { setInStorage } from '../../../utils/storage';

export default function LanguageSelector() {
  const { i18n }: UseTranslationResponse<'translation', undefined> =
    useTranslation();
  const [lang, setLang] = useState<string>(
    i18n.language || SUPPORTED_LANGUAGES[0],
  );
  const location = useLocation();
  const navigate = useNavigate();

  const redirectWithLang = (lng: string) => {
    const { pathname, search, hash } = location;
    const parts = pathname.split('/');
    // replace the first segment (after leading slash) with the new language
    if (parts.length > 1) {
      parts[1] = lng;
    } else {
      // fallback: build a path starting with the language
      parts[1] = lng;
    }
    const newPath = parts.join('/');
    void navigate(newPath + (search || '') + (hash || ''), { replace: true });
  };

  return (
    <select
      value={lang}
      onChange={e => {
        const lng = e.target.value;
        setLang(lng);
        setInStorage('language', lng);
        redirectWithLang(lng);
      }}
      style={{ marginRight: 20 }}
      aria-label="Select language"
    >
      {SUPPORTED_LANGUAGES.map(l => (
        <option key={l} value={l}>
          {l.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
