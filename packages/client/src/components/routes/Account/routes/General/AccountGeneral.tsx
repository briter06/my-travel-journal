import './AccountGeneral.css';
import Section from './Section/Section';
import { useAppSelector } from '../../../../../store/hooks';

function AccountGeneral() {
  const me = useAppSelector(state => state.session.me)!;

  return (
    <div className="account-general">
      <Section title="My Information">
        <div className="at-section__content-inner">
          <div className="at-info-row">
            <div className="at-info-label">Email</div>
            <div className="at-info-value">{me.email}</div>
          </div>
          <div className="at-info-row">
            <div className="at-info-label">Name</div>
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
