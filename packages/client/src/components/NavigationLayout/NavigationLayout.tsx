import "./NavigationLayout.css";
import { ReactNode } from "react";
import { Sidebar } from "react-pro-sidebar";
import { motion } from "framer-motion";

interface NavigationLayoutProps {
  navbar: ReactNode;
  sidebar: ReactNode;
  content: ReactNode;
  isOpen: boolean;
}

function NavigationLayout({
  navbar,
  sidebar,
  content,
  isOpen,
}: NavigationLayoutProps) {
  return (
    <div className="MainContainer">
      <div className="MainContainerTopBar">
        <div style={{padding: '0 15px', width: '100%'}}>
          {navbar}
        </div>
      </div>
      <div className="MainContainerContent">
        <motion.div
          className="SideBarContainer"
          animate={{
            width: isOpen ? "20%" : 0,
            opacity: isOpen ? 1 : 0,
          }}
          initial={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Sidebar className="SideBar">
            {sidebar}
          </Sidebar>
        </motion.div>

        <div className="NavigationContent">{content}</div>
      </div>
    </div>
  );
}

export default NavigationLayout;
