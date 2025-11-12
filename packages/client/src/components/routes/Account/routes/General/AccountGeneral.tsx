import './AccountGeneral.css';
import Section from './Section/Section';
import { useAppSelector } from '../../../../../store/hooks';
import { useTranslation } from 'react-i18next';

function AccountGeneral() {
  const { t } = useTranslation();
  const me = useAppSelector(state => state.session.me)!;

  return (
    <div className="account-general">
      <Section title={t('account.myInformation.title')}>
        <div className="at-section__content-inner">
          <div className="at-info-row">
            <div className="at-info-label">
              {t('account.myInformation.label.email')}
            </div>
            <div className="at-info-value">{me.email}</div>
          </div>
          <div className="at-info-row">
            <div className="at-info-label">
              {t('account.myInformation.label.name')}
            </div>
            <div className="at-info-value">
              {`${me.firstName} ${me.lastName}`}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

export default AccountGeneral;
