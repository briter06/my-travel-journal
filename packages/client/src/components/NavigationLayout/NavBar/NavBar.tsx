import './NavBar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useRef, useState } from 'react';
import { Menu, MenuItem } from 'react-pro-sidebar';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getInitials } from '../../../utils/user';
import { clearSession } from '../../../store/slices/session';
import { toggleSideBar } from '../../../store/slices/navigation';
import { useMatches } from 'react-router';

function NavBar() {
  const me = useAppSelector(state => state.session.me)!;
  const [openMenu, setOpenMenu] = useState(false);
  const avatarRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [popupPos, setPopupPos] = useState<{ top: number; right: number }>({
    top: 0,
    right: 0,
  });

  const isSideBarOpen = useAppSelector(state => state.navigation.isSideBarOpen);
  const dispatch = useAppDispatch();

  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];
  const handle = currentMatch.handle as { hasSideBar?: boolean } | undefined;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      // if click is inside avatar or inside popup, ignore
      if (
        (avatarRef.current && avatarRef.current.contains(target)) ||
        (popupRef.current && popupRef.current.contains(target))
      ) {
        return;
      }
      setOpenMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // compute popup position based on avatar button location so the menu is an overlay
  useEffect(() => {
    if (!openMenu) return;

    const compute = () => {
      const avatar = avatarRef.current;
      if (!avatar) return;
      const rect = avatar.getBoundingClientRect();
      // position the popup just below the avatar, anchored to the avatar's right edge
      const top = rect.bottom + window.scrollY + 10; // small gap
      const right = Math.max(25, window.innerWidth - rect.right);
      setPopupPos({ top, right });
    };

    compute();
    window.addEventListener('resize', compute);
    window.addEventListener('scroll', compute, true);
    return () => {
      window.removeEventListener('resize', compute);
      window.removeEventListener('scroll', compute, true);
    };
  }, [openMenu]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#000066',
        height: '100%',
        padding: '0 15px',
      }}
    >
      {handle?.hasSideBar === true ? (
        <button
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontSize: '1.5rem',
          }}
          onClick={() => dispatch(toggleSideBar())}
        >
          <i
            className={`bi ${isSideBarOpen ? 'bi-x' : 'bi-list'}`}
            style={{ color: 'white' }}
          ></i>
        </button>
      ) : null}

      <div
        style={{
          textAlign: 'center',
          width: '100%',
          fontFamily: 'Pacifico, cursive',
          fontSize: '1.4rem',
          color: 'white',
        }}
      >
        My Travel Journal
      </div>
      <div
        className="avatar"
        ref={avatarRef}
        onClick={() => setOpenMenu(!openMenu)}
      >
        {getInitials(me.firstName, me.lastName)}
      </div>
      {/* Popup Menu */}
      {openMenu && (
        <div
          ref={popupRef}
          className="w-56 bg-white rounded-xl shadow-lg border border-gray-200 popup-menu popup-animate"
          style={{
            position: 'fixed',
            top: popupPos.top,
            right: popupPos.right,
            zIndex: 1000,
          }}
        >
          <Menu>
            <MenuItem disabled style={{ color: 'black', fontWeight: 'bold' }}>
              {me.firstName} {me.lastName}
            </MenuItem>
            <MenuItem>My Account</MenuItem>
            <MenuItem
              onClick={() => {
                dispatch(clearSession());
                localStorage.clear();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </div>
      )}
    </div>
  );
}

export default NavBar;
