import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SelectAutoComplete.css';

export type Option<T> = { id: T; label: string };

type Props<T> = {
  options: Option<T>[];
  value?: T | null;
  onChange: (id: T | null) => void;
  generateCustomId?: (value: string) => T;
  placeholder?: string;
  maxMatches?: number;
  // when true, focusing the input will show matches even with empty query
  showOnFocus?: boolean;
  // optional node or render function to show when there are no matches for the typed query.
  // If omitted, nothing will be displayed when there are zero matches.
  noMatch?: {
    node: (query: string) => React.ReactNode;
    callback: (query: string) => void;
  };
  disabled?: boolean;
};

export default function SelectAutoComplete<T = string>({
  options,
  value,
  onChange,
  generateCustomId,
  placeholder,
  maxMatches = 5,
  showOnFocus = false,
  noMatch,
  disabled,
}: Props<T>) {
  const { t } = useTranslation();
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

  useEffect(() => {
    if (selectedLabel.trim() !== '') {
      setQuery('');
      setOpen(false);
    }
  }, [selectedLabel]);

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
          placeholder={
            selectedLabel ||
            (placeholder ?? t('selectAutoComplete.placeholder'))
          }
          value={query}
          onChange={e => {
            // keep the raw input (allow spaces) but use a trimmed value for id-generation
            const raw = e.target.value;
            const trimmed = raw.trim();
            if (generateCustomId != null) {
              onChange(generateCustomId(trimmed));
            } else {
              onChange(null);
            }
            setQuery(raw);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          disabled={disabled === true}
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
      {open &&
        normalized.length > 0 &&
        matches.length === 0 &&
        noMatch != null && (
          <div className="sac-list" role="listbox">
            <div
              key="no-match"
              role="option"
              className="sac-item"
              onClick={() => noMatch.callback(query)}
            >
              {noMatch.node(query)}
            </div>
          </div>
        )}
    </div>
  );
}
