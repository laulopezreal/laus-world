import { ReactNode, useState, useMemo } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { ThemeToggle } from './ThemeToggle';
import { FolderTree } from './FolderTree';
import { buildFolderTree } from '../lib/folder-tree';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/tags', label: 'Tags' },
  { to: '/graph', label: 'Graph' }
];

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const folderTree = useMemo(() => buildFolderTree(), []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-6xl gap-6 px-4 py-6 lg:px-8">
        <aside
          className={clsx(
            'fixed inset-y-0 left-0 z-40 flex w-72 translate-x-[-100%] flex-col overflow-y-auto bg-surface/95 px-6 pb-6 pt-8 shadow-card backdrop-blur lg:static lg:translate-x-0 lg:bg-transparent lg:shadow-none',
            open && 'translate-x-0'
          )}
        >
          <div className="flex items-center justify-between min-h-[4rem]">
            <Link to="/" className="text-xl font-display tracking-tight hover:text-accent transition-colors">
              Laura&apos;s World
            </Link>
            <button
              className="rounded-full border border-border px-3 py-2 text-xs uppercase tracking-[0.2em] lg:hidden"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
          <nav className="mt-10 space-y-1 text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  clsx(
                    'block rounded-xl px-4 py-3 transition-all duration-300 ease-smooth',
                    isActive
                      ? 'bg-accentSoft text-text'
                      : 'text-muted hover:text-text hover:translate-x-1'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-12 mb-4 px-4 text-2xs uppercase tracking-wide-xl text-muted font-bold">
            Notes Tree
          </div>
          <div className="flex-1 overflow-y-auto">
            <FolderTree nodes={folderTree} />
          </div>

          <div className="mt-6 flex items-center gap-2">
            <ThemeToggle />
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <header className="sticky top-0 z-40 mb-6 rounded-2xl border border-border bg-surface/80 px-4 py-3 backdrop-blur-md">
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="global-search-input"
              />
              <span className="hidden text-xs text-muted sm:block">⌘K</span>
              <button
                className="rounded-full border border-border px-3 py-2 text-xs uppercase tracking-[0.2em] lg:hidden"
                type="button"
                onClick={() => setOpen(true)}
              >
                Menu
              </button>
            </form>
          </header>
          {children}
        </main>
      </div>
      {open && (
        <button
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
