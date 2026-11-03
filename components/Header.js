import Brand from './Brand';
import ThemeToggle from './ThemeToggle';

// Top bar for pages without the sidebar: the landing page and shared handovers.
export default function Header({ children }) {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
        <Brand />
        <div className="flex items-center gap-3 text-sm">{children}<ThemeToggle /></div>
      </div>
    </header>
  );
}
