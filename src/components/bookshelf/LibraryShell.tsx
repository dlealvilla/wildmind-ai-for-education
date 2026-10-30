import { ReactNode } from 'react';
import { LibraryHeader } from './LibraryHeader';
import { cn } from '@/lib/utils';

/** Full-bleed wood background shell used by login, dashboards, course lists */
export function LibraryShell({
  children,
  className,
  contentClassName,
  showHeader = true,
  compactHeader = false,
}: {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  showHeader?: boolean;
  compactHeader?: boolean;
}) {
  return (
    <div className={cn('min-h-screen bg-wood text-parchment flex flex-col', className)}>
      <div
        className={cn(
          'flex-1 flex flex-col w-full mx-auto',
          'px-6 sm:px-10 lg:px-16 py-8 lg:py-10',
          'max-w-[1440px]',
          contentClassName,
        )}
      >
        {showHeader && <LibraryHeader compact={compactHeader} />}
        {children}
      </div>
    </div>
  );
}
