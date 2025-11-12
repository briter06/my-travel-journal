import './Account.css';
import NavigationContent from '../../utils/NavigationContent/NavigationContent';
import { Menu, MenuItem } from 'react-pro-sidebar';
import { SIDE_BAR_BACKGROUND_COLOR } from '../../../utils/colors';
import { getInitials } from '../../../utils/user';
import { useAppSelector } from '../../../store/hooks';
import { Link, Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';

function Account() {
  const me = useAppSelector(state => state.session.me)!;
  const { t } = useTranslation();

  return (
    <NavigationContent
      isOpen={true}
      sidebar={
        <Menu style={{ backgroundColor: SIDE_BAR_BACKGROUND_COLOR }}>
          <MenuItem disabled style={{ color: 'black', height: '100%' }}>
            <div
              style={{
                paddingTop: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <div className="avatar">
                {getInitials(me.firstName, me.lastName)}
              </div>
              <div style={{ marginTop: '8px', fontWeight: 'bold' }}>
                {me.firstName} {me.lastName}
              </div>
            </div>
          </MenuItem>
          <hr className="my-2 border-gray-200" />
          <MenuItem component={<Link to="" />}>
            {t('navigation.profile.general')}
          </MenuItem>
          <MenuItem component={<Link to="trips" />}>
            {t('navigation.profile.myTrips')}
          </MenuItem>
        </Menu>
      }
      content={<Outlet />}
    />
  );
}

export default Account;
