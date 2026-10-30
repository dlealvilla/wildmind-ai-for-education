import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { cn } from '@/lib/utils';

export function LibraryHeader({
  className,
  showUser = true,
  compact = false,
}: {
  className?: string;
  showUser?: boolean;
  compact?: boolean;
}) {
  const { user, logout } = useAuth();

  const home =
    user?.role === 'TEACHER'
      ? '/teacher/home'
      : user?.role === 'ADMIN'
        ? '/admin'
        : user?.role === 'STUDENT'
          ? '/student/home'
          : '/';

  return (
    <header
      className={cn(
        'flex justify-between items-center',
        compact ? 'mb-4' : 'mb-10',
        className,
      )}
    >
      <Link to={home} className="flex items-center gap-3.5 group">
        <div
          className={cn(
            'flex items-center justify-center rounded-[2px] bg-gold text-primary-foreground',
            compact ? 'w-8 h-8' : 'w-10 h-10',
          )}
        >
          <GraduationCap className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
        </div>
        <div>
          <div className={cn('font-serif font-bold text-parchment', compact ? 'text-lg' : 'text-xl')}>
            Wildmind
          </div>
          {!compact && (
            <div className="text-xs text-[#A89070] tracking-[0.08em]">EDUCATION LIBRARY</div>
          )}
        </div>
      </Link>

      {showUser && user && (
        <div className="text-right">
          <div className="font-semibold text-sm text-parchment">{user.name}</div>
          <div className="text-xs text-gold tracking-[0.06em] flex items-center justify-end gap-3">
            <span>{user.role}</span>
            <button
              type="button"
              onClick={logout}
              className="text-[#A89070] hover:text-parchment tracking-normal font-normal"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
