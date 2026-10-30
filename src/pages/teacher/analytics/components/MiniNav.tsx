import { cn } from '@/lib/utils';

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'breakdown', label: 'Breakdown' },
  { id: 'prompt-analysis', label: 'Prompts' },
];

interface MiniNavProps {
  className?: string;
}

export function MiniNav({ className }: MiniNavProps) {
  return (
    <nav
      className={cn(
        'fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:block',
        className
      )}
    >
      <div className="bg-[#3D2518]/90 backdrop-blur-sm border border-[#8B6914]/40 rounded-[2px] p-2 shadow-md">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="block px-3 py-2 text-xs font-medium text-[#A89070] hover:text-parchment hover:bg-[#2C1810] rounded transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="block px-3 py-2 text-xs font-medium text-[#8B6914] hover:text-[#A89070] hover:bg-[#2C1810] rounded transition-colors"
            >
              ↑ Top
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
