import './NavBar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useAppSelector } from '../../store/hooks';
import { getInitials } from '../../utils/user';

interface NavBarData {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

function NavBar({ isOpen, setIsOpen }: NavBarData) {
  const me = useAppSelector(state => state.session.me)!;

  return (
    <div style={{ display: 'flex' }}>
      <button
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          fontSize: '1.5rem',
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className={`bi ${isOpen ? 'bi-x' : 'bi-list'}`}></i>
      </button>
      <div
        style={{
          textAlign: 'center',
          width: '100%',
          fontFamily: 'Pacifico, cursive',
          fontSize: '1.4rem',
        }}
      >
        My Travel Journal
      </div>
      <div className="avatar">{getInitials(me.firstName, me.lastName)}</div>
    </div>
  );
}

export default NavBar;
