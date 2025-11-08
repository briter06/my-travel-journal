import './NavigationLayout.css';
import NavBar from './NavBar/NavBar';
import { Outlet } from 'react-router';

function NavigationLayout() {
  return (
    <div className="NavigationLayoutContainer">
      <div className="NavigationLayoutTopBar">
        <div style={{ width: '100%', height: '100%' }}>
          <NavBar />
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default NavigationLayout;
