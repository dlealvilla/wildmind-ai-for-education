import { useState, useEffect } from 'react';
import { LibraryShell, CourseShelf, type ShelfCourse } from '@/components/bookshelf';
import { getAuthHeaders } from '@/lib/auth/AuthContext';

interface Course {
  id: string;
  code: string;
  title: string;
  term: string;
  status: 'CURRENT' | 'PAST';
}

export function StudentHome() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/student/courses', {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      setCourses(data.courses);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const currentCourses = courses.filter((c) => c.status === 'CURRENT') as ShelfCourse[];
  const pastCourses = courses.filter((c) => c.status === 'PAST') as ShelfCourse[];

  if (isLoading) {
    return (
      <LibraryShell>
        <div className="flex items-center justify-center h-64 text-foreground-muted">
          Loading courses...
        </div>
      </LibraryShell>
    );
  }

  if (error) {
    return (
      <LibraryShell>
        <div className="bg-error/10 text-error border border-error/30 p-4 rounded-[2px]">
          {error}
        </div>
      </LibraryShell>
    );
  }

  return (
    <LibraryShell contentClassName="pb-6">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-parchment mb-2">My Courses</h1>
        <p className="text-sm text-[#A89070]">Pull a volume from the shelf to open a course</p>
      </div>

      {currentCourses.length === 0 && pastCourses.length === 0 ? (
        <div className="bg-page/5 border border-dashed border-shelf rounded-[2px] p-12 text-center text-foreground-muted">
          No courses on your shelf yet
        </div>
      ) : (
        <CourseShelf
          current={currentCourses}
          past={pastCourses}
          basePath="/student/courses"
        />
      )}
    </LibraryShell>
  );
}
