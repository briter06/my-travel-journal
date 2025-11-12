import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useParams } from 'react-router';
import { setInStorage } from '../../utils/storage';

function LanguageInjector() {
  const { lng } = useParams();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (lng != null && i18n.language !== lng) {
      void i18n.changeLanguage(lng);
      setInStorage('language', lng);
    }
  }, [lng, i18n]);

  return <Outlet />;
}

export default LanguageInjector;
