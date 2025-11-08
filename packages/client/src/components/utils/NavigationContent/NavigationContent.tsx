import './NavigationContent.css';
import { ReactNode } from 'react';
import NavigationSideBar from '../NavigationSideBar/NavigationSideBar';

interface NavigationContentProps {
  content: ReactNode;
  isOpen: boolean;
  sidebar: ReactNode;
}

function NavigationContent({
  content,
  isOpen,
  sidebar,
}: NavigationContentProps) {
  return (
    <div className="NavigationContentContainer">
      <NavigationSideBar isOpen={isOpen} sidebar={sidebar} />
      <div className="NavigationContent">{content}</div>
    </div>
  );
}

export default NavigationContent;
