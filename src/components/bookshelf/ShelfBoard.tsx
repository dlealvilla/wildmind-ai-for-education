import { cn } from '@/lib/utils';

export function ShelfBoard({ className }: { className?: string }) {
  return (
    <div
      className={cn('bg-shelf-board h-4 rounded-[2px] shadow-[0_4px_12px_rgba(0,0,0,0.4)]', className)}
      aria-hidden
    />
  );
}
