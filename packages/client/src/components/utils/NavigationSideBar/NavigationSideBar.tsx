import './NavigationSideBar.css';
import { ReactNode } from 'react';
import { Sidebar } from 'react-pro-sidebar';
import { motion } from 'framer-motion';

interface NavigationSideBarProps {
  isOpen: boolean;
  sidebar: ReactNode;
}

function NavigationSideBar({ sidebar, isOpen }: NavigationSideBarProps) {
  return (
    <motion.div
      className="SideBarContainer"
      animate={{
        width: isOpen ? '20%' : 0,
        opacity: isOpen ? 1 : 0,
      }}
      initial={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <Sidebar className="SideBar">{sidebar}</Sidebar>
    </motion.div>
  );
}

export default NavigationSideBar;
