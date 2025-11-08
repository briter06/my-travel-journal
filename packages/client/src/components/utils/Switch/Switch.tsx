import React, { useEffect, useState } from 'react';
import './Switch.css';

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  ariaLabel?: string;
}

interface SizeObject {
  width: number;
  height: number;
  thumbSize: number;
}

type SizeProp = 'sm' | 'md' | 'lg' | SizeObject;

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  ariaLabel?: string;
  size?: SizeProp;
}

export default function Switch({
  checked = false,
  onChange,
  ariaLabel = 'Toggle',
  size = 'md',
}: SwitchProps) {
  const [on, setOn] = useState<boolean>(checked);

  useEffect(() => {
    setOn(checked);
  }, [checked]);

  const toggle = () => {
    const next = !on;
    setOn(next);
    onChange?.(next);
  };

  // map size prop to CSS variables used by the stylesheet
  const getSizeVars = (s: SizeProp) => {
    let w = 56;
    let h = 30;
    let t = 24;
    if (typeof s === 'string') {
      if (s === 'sm') {
        w = 40;
        h = 22;
        t = 18;
      } else if (s === 'lg') {
        w = 72;
        h = 40;
        t = 34;
      } else {
        // md
        w = 56;
        h = 30;
        t = 24;
      }
    } else {
      w = s.width ?? w;
      h = s.height ?? h;
      t = s.thumbSize ?? t;
    }
    return {
      ['--width']: `${w}px`,
      ['--height']: `${h}px`,
      ['--thumb-size']: `${t}px`,
    } as React.CSSProperties;
  };

  const cssVars = getSizeVars(size);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      className={`switch ${on ? 'switch--on' : ''}`}
      onClick={toggle}
      style={cssVars}
    >
      <span className="switch__track" />
      <span className="switch__thumb" />
    </button>
  );
}
