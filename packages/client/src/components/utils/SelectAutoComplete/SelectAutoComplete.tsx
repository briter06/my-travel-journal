import React, { useEffect, useRef, useState } from 'react';
import './SelectAutoComplete.css';

export type Option = { id: string | number; label: string };

type Props = {
  options: Option[];
  value?: string | number | null;
  onChange: (id: string | number | null) => void;
  placeholder?: string;
  maxMatches?: number;
  // when true, focusing the input will show matches even with empty query
  showOnFocus?: boolean;
  // optional node or render function to show when there are no matches for the typed query.
  // If omitted, nothing will be displayed when there are zero matches.
  noMatchNode?: {
    node: (query: string) => React.ReactNode;
    callback: (query: string) => void;
  };
};

export default function SelectAutoComplete({
  options,
  value,
  onChange,
  placeholder,
  maxMatches = 5,
  showOnFocus = false,
  noMatchNode,
}: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const selectedLabel =
    value != null
      ? (options.find(o => String(o.id) === String(value))?.label ?? '')
      : '';
  const showSelectedAsPlaceholder = value != null && query === '';

  const normalized = query.trim().toLowerCase();
  const matches = normalized
    ? options
        .filter(o => o.label.toLowerCase().includes(normalized))
        .slice(0, maxMatches)
    : [];

  const showList =
    open && (normalized.length > 0 ? matches.length > 0 : showOnFocus);

  const clearSelection = () => {
    setQuery('');
    setOpen(false);
    onChange(null);
  };

  return (
    <div className="sac-container" ref={ref}>
      <div style={{ position: 'relative' }}>
        <input
          className={`sac-input ${showSelectedAsPlaceholder ? 'sac-has-selected' : ''}`}
          placeholder={selectedLabel || placeholder || 'Search...'}
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          aria-autocomplete="list"
          aria-haspopup="listbox"
        />
        {(value != null || query.length > 0) && (
          <button
            type="button"
            className="sac-clear"
            aria-label="Clear selection"
            onClick={clearSelection}
            style={{
              position: 'absolute',
              right: 6,
              top: 6,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        )}
      </div>

      {showList && (
        <div className="sac-list" role="listbox">
          {matches.map(m => (
            <div
              key={String(m.id)}
              role="option"
              className="sac-item"
              onClick={() => {
                setQuery('');
                setOpen(false);
                onChange(m.id);
              }}
            >
              {m.label}
            </div>
          ))}
        </div>
      )}

      {/* when user typed but got no matches, optionally render provided node */}
      {open && normalized.length > 0 && matches.length === 0 && noMatchNode && (
        <div className="sac-list" role="listbox">
          {noMatchNode != null ? (
            <div
              key="no-match"
              role="option"
              className="sac-item"
              onClick={() => noMatchNode.callback(query)}
            >
              {noMatchNode.node(query)}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
