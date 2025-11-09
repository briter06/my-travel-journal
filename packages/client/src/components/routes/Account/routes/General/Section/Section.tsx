import React from 'react';
import './Section.css';

type SectionProps = {
  title: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

export default function Section({
  title,
  children,
  className = '',
}: SectionProps) {
  return (
    <section className={`at-section ${className}`}>
      <div className="at-section__title">{title}</div>
      <div className="at-section__content">{children}</div>
    </section>
  );
}
