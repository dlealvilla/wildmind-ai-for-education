import { BookSpine, NewCourseSpine } from './BookSpine';
import { ShelfBoard } from './ShelfBoard';

export interface ShelfCourse {
  id: string;
  code: string;
  title: string;
  term?: string;
  status: 'CURRENT' | 'PAST';
  studentCount?: number;
  assessmentCount?: number;
}

interface CourseShelfProps {
  current: ShelfCourse[];
  past: ShelfCourse[];
  basePath: '/teacher/courses' | '/student/courses';
  showNewSlot?: boolean;
  footerStats?: string;
}

export function CourseShelf({
  current,
  past,
  basePath,
  showNewSlot = false,
  footerStats,
}: CourseShelfProps) {
  const currentTerm = current[0]?.term || past[0]?.term || '';
  const pastTerm = past[0]?.term || '';

  return (
    <div className="flex-1 flex flex-col justify-end min-h-[360px]">
      <div className="flex items-end gap-2.5 min-h-[320px] px-2 sm:px-5 overflow-x-auto pb-0">
        {current.map((c, i) => (
          <BookSpine
            key={c.id}
            code={c.code}
            title={c.title}
            href={`${basePath}/${c.id}`}
            status="OPEN"
            showFoil={i === 0}
          />
        ))}
        {showNewSlot && <NewCourseSpine />}
        <div className="flex-1 min-w-8" />
        {past.map((c) => (
          <BookSpine
            key={c.id}
            code={c.code}
            title={c.title}
            href={`${basePath}/${c.id}`}
            status="CLOSED"
            muted
          />
        ))}
      </div>
      <ShelfBoard />
      <div className="flex flex-wrap justify-between gap-2 mt-4 text-xs text-[#8B6914]">
        <span>{currentTerm ? `Current term · ${currentTerm}` : 'Current term'}</span>
        {footerStats && <span className="text-center">{footerStats}</span>}
        <span>{pastTerm ? `Past term · ${pastTerm}` : past.length ? 'Past term' : ''}</span>
      </div>
    </div>
  );
}
