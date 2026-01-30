import { ReactNode, useState, useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { ThemeToggle } from './ThemeToggle';
import { FolderTree } from './FolderTree';
import { buildFolderTree } from '../lib/folder-tree';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/tags', label: 'Tags' },
  { to: '/search', label: 'Search' },
  { to: '/graph', label: 'Graph' }
];

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const folderTree = useMemo(() => buildFolderTree(), []);

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-6xl gap-6 px-4 py-6 lg:px-8">
        <aside
          className={clsx(
            'fixed inset-y-0 left-0 z-40 flex w-72 translate-x-[-100%] flex-col overflow-y-auto bg-surface/95 px-6 pb-6 pt-8 shadow-card backdrop-blur lg:static lg:translate-x-0 lg:bg-transparent lg:shadow-none',
            open && 'translate-x-0'
          )}
        >
          <div className="flex items-center justify-between">
            <Link to="/" className="text-lg font-display tracking-wide">
              Laura&apos;s World
            </Link>
            <button
              className="rounded-full border border-border px-3 py-2 text-xs uppercase tracking-[0.2em] lg:hidden"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
          <nav className="mt-10 space-y-2 text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  clsx(
                    'block rounded-xl px-4 py-3 transition-all duration-300 ease-smooth',
                    isActive
                      ? 'bg-accentSoft text-text shadow-glow'
                      : 'text-muted hover:bg-elevated hover:text-text'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 flex-1 overflow-y-auto">
            <h3 className="mb-3 px-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Notes</h3>
            <FolderTree nodes={folderTree} />
          </div>

          <div className="mt-8 pl-1">
            <ThemeToggle />
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-elevated/70 p-4 text-xs text-muted">
            Obsidian vault reader &middot; read-only.
          </div>
        </aside>

        <main className="flex-1 lg:ml-72">
          <header className="sticky top-0 z-30 mb-6 flex items-center justify-between rounded-2xl border border-border bg-surface/70 px-4 py-3 backdrop-blur">
            <div className="text-sm text-muted">Welcome back, Laura.</div>
            <button
              className="rounded-full border border-border px-3 py-2 text-xs uppercase tracking-[0.2em] lg:hidden"
              onClick={() => setOpen(true)}
            >
              Menu
            </button>
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
