import { useEffect, useState } from 'react';
import './CheckBox.css';

interface SizeObject {
  size: number; // px for the square box
}

type SizeProp = 'sm' | 'md' | 'lg' | SizeObject;

interface CheckBoxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: SizeProp;
  ariaLabel?: string;
  disableClick?: boolean;
}

export default function CheckBox({
  checked = false,
  onChange,
  size = 'md',
  ariaLabel = 'Checkbox',
  disableClick = false,
}: CheckBoxProps) {
  const [on, setOn] = useState<boolean>(checked);

  useEffect(() => {
    setOn(checked);
  }, [checked]);

  const toggle = () => {
    const next = !on;
    setOn(next);
    onChange?.(next);
  };

  const getSizeVars = (s: SizeProp) => {
    let px = 20;
    if (typeof s === 'string') {
      if (s === 'sm') px = 16;
      else if (s === 'lg') px = 28;
      else px = 20;
    } else {
      px = s.size ?? px;
    }
    return {
      ['--cb-size']: `${px}px`,
      ['--cb-check']: `${Math.round(px * 0.55)}px`,
    } as React.CSSProperties;
  };

  const cssVars = getSizeVars(size);

  return (
    <label className="checkbox" style={cssVars}>
      <input
        type="checkbox"
        disabled={disableClick}
        aria-label={ariaLabel}
        checked={on}
        onChange={() => toggle()}
        className="checkbox__input"
      />
      <span className={`checkbox__box ${on ? 'checkbox__box--checked' : ''}`}>
        <svg
          className="checkbox__check"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="M5 13l4 4L19 7"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </label>
  );
}
