import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  spinePaletteForCode,
  spineGradient,
  spineHeight,
  spineWidth,
} from '@/lib/bookshelf/spineColors';

export interface BookSpineProps {
  code: string;
  title?: string;
  href?: string;
  status?: 'OPEN' | 'CLOSED' | 'CURRENT' | 'PAST';
  muted?: boolean;
  showFoil?: boolean;
  className?: string;
  onClick?: () => void;
}

export function BookSpine({
  code,
  title,
  href,
  status,
  muted,
  showFoil,
  className,
  onClick,
}: BookSpineProps) {
  const palette = spinePaletteForCode(code);
  const height = spineHeight(code);
  const width = spineWidth(code);
  const isClosed = status === 'CLOSED' || status === 'PAST' || muted;

  const inner = (
    <div
      className={cn(
        'spine relative flex flex-col items-center justify-center writing-spine cursor-pointer',
        'rounded-t-[3px] text-parchment transition-transform hover:-translate-y-2',
        isClosed && 'opacity-55',
        className,
      )}
      style={{
        width,
        height,
        background: spineGradient(palette),
        boxShadow:
          'inset -3px 0 8px rgba(0,0,0,0.25), 2px 0 6px rgba(0,0,0,0.2)',
      }}
      onClick={onClick}
      role={href || onClick ? 'button' : undefined}
    >
      {showFoil && (
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-[1.5px]"
          style={{ borderColor: palette.accent }}
        />
      )}
      <span
        className="font-serif font-bold tracking-[0.15em]"
        style={{ fontSize: width > 64 ? 15 : 13, marginTop: showFoil ? 40 : 0 }}
      >
        {code}
      </span>
      {title && (
        <span
          className="opacity-85 tracking-[0.06em] mt-2.5 max-h-[40%] overflow-hidden"
          style={{ fontSize: 11 }}
        >
          {title}
        </span>
      )}
      {(status === 'OPEN' || status === 'CURRENT' || status === 'CLOSED' || status === 'PAST') && (
        <span
          className="absolute bottom-5 tracking-[0.1em] font-semibold"
          style={{ fontSize: 10, color: isClosed ? undefined : palette.accent }}
        >
          {isClosed ? 'CLOSED' : 'OPEN'}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link to={href} className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
        {inner}
      </Link>
    );
  }
  return inner;
}

export function NewCourseSpine({ onClick, href }: { onClick?: () => void; href?: string }) {
  const body = (
    <div
      className="writing-spine flex items-center justify-center rounded-t-[3px] border-2 border-dashed border-shelf text-[#8B6914] tracking-[0.1em] cursor-pointer hover:border-gold hover:text-gold transition-colors"
      style={{ width: 56, height: 200, fontSize: 12 }}
      onClick={onClick}
    >
      + New course
    </div>
  );
  if (href) return <Link to={href}>{body}</Link>;
  return body;
}

export function DecorativeSpine({
  label,
  color,
  height = 180,
  width = 48,
}: {
  label: string;
  color: string;
  height?: number;
  width?: number;
}) {
  return (
    <div
      className="spine flex flex-col items-center justify-center writing-spine rounded-t-[3px] text-parchment"
      style={{
        width,
        height,
        background: color,
        boxShadow:
          'inset -3px 0 8px rgba(0,0,0,0.25), 2px 0 6px rgba(0,0,0,0.2)',
        fontSize: 13,
        letterSpacing: '0.12em',
        fontFamily: 'var(--font-serif)',
      }}
    >
      {label}
    </div>
  );
}
