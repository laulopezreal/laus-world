import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { vaultIndex } from '../lib/data';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const fuse = useMemo(
        () =>
            new Fuse(vaultIndex.notes, {
                keys: ['title', 'content', 'tags'],
                threshold: 0.3
            }),
        []
    );

    const results = query ? fuse.search(query).map((result) => result.item) : vaultIndex.notes.slice(0, 8);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % results.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
        } else if (e.key === 'Enter' && results[selectedIndex]) {
            e.preventDefault();
            navigate(`/note/${results[selectedIndex].slug}`);
            onClose();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="command-palette-backdrop" onClick={onClose} />
            <div className="command-palette">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search notes... (↑↓ to navigate, ↵ to open, esc to close)"
                    className="command-palette-input"
                />
                <div className="command-palette-results">
                    {results.length === 0 && (
                        <div className="command-palette-empty">No notes found</div>
                    )}
                    {results.map((note, index) => (
                        <button
                            key={note.slug}
                            className={`command-palette-item ${index === selectedIndex ? 'selected' : ''}`}
                            onClick={() => {
                                navigate(`/note/${note.slug}`);
                                onClose();
                            }}
                            onMouseEnter={() => setSelectedIndex(index)}
                        >
                            <div className="command-palette-item-title">{note.title}</div>
                            <div className="command-palette-item-path">{note.path}</div>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}
