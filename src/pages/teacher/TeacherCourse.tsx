import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { getAuthHeaders } from '../../lib/auth/AuthContext';

interface Student {
  id: string;
  name: string;
  email: string;
  attemptCount: number;
  lastActiveAt: string | null;
}

interface Assessment {
  id: string;
  title: string;
  status: 'OPEN' | 'CLOSED';
  effectiveClosed: boolean;
  dueAt: string | null;
  closeAtDue: boolean;
  pdfBlobUrl: string | null;
  pdfFileName: string | null;
  attemptCount: number;
  markedCount: number;
}

interface CourseDetails {
  id: string;
  code: string;
  title: string;
  term: string;
  students: Student[];
  assessments: Assessment[];
}

export function TeacherCourse() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'students' | 'assessments'>('students');

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await fetch(`/api/teacher/courses/${courseId}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch course details');
      }

      const data = await response.json();
      setCourse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (assessmentId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'OPEN' ? 'CLOSED' : 'OPEN';
    try {
      const response = await fetch(`/api/teacher/assessments/${assessmentId}`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update assessment');
      }

      fetchCourseDetails();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-foreground-muted">Loading course...</div>
        </div>
      </AuthLayout>
    );
  }

  if (error || !course) {
    return (
      <AuthLayout>
        <div className="bg-error/10 text-error border border-error/30 p-4 rounded-[2px]">
          {error || 'Course not found'}
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-foreground-muted">
          <Link to="/teacher/home" className="hover:text-parchment">Home</Link>
          <span>/</span>
          <span className="text-ink">{course.code}</span>
        </div>

        {/* Course header */}
        <div className="bg-page rounded-[2px] border border-[#E0D4C0] p-6">
          <div className="text-sm text-secondary font-medium mb-1">{course.code}</div>
          <h1 className="text-2xl font-bold text-ink mb-2">{course.title}</h1>
          <div className="text-foreground-muted">{course.term}</div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-[#E0D4C0]">
          <button
            onClick={() => setActiveTab('students')}
            className={`pb-2 px-1 font-medium ${
              activeTab === 'students'
                ? 'border-b-2 border-gold text-secondary'
                : 'text-foreground-muted hover:text-parchment'
            }`}
          >
            Students ({course.students.length})
          </button>
          <button
            onClick={() => setActiveTab('assessments')}
            className={`pb-2 px-1 font-medium ${
              activeTab === 'assessments'
                ? 'border-b-2 border-gold text-secondary'
                : 'text-foreground-muted hover:text-parchment'
            }`}
          >
            Assessments ({course.assessments.length})
          </button>
        </div>

        {/* Students tab */}
        {activeTab === 'students' && (
          <section>
            {course.students.length === 0 ? (
              <div className="bg-page-muted rounded-[2px] p-8 text-center text-foreground-muted">
                No students enrolled
              </div>
            ) : (
              <div className="bg-page rounded-[2px] border border-[#E0D4C0] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-page-muted">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Name</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Email</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Attempts</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Last Active</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E0D4C0]">
                    {course.students.map((student) => (
                      <tr key={student.id} className="hover:bg-page-muted">
                        <td className="px-4 py-3 font-medium text-ink">{student.name}</td>
                        <td className="px-4 py-3 text-foreground-muted">{student.email}</td>
                        <td className="px-4 py-3 text-foreground-muted">{student.attemptCount}</td>
                        <td className="px-4 py-3 text-foreground-muted text-sm">
                          {formatDate(student.lastActiveAt)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            to={`/teacher/courses/${courseId}/students/${student.id}`}
                            className="text-secondary hover:text-secondary text-sm font-medium"
                          >
                            View Progress →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Assessments tab */}
        {activeTab === 'assessments' && (
          <section className="space-y-4">
            {course.assessments.length === 0 ? (
              <div className="bg-page-muted rounded-[2px] p-8 text-center text-foreground-muted">
                No assessments yet
              </div>
            ) : (
              <div className="bg-page rounded-[2px] border border-[#E0D4C0] divide-y">
                {course.assessments.map((assessment) => (
                  <div key={assessment.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-ink">{assessment.title}</h3>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              assessment.effectiveClosed
                                ? 'bg-error/10 text-error border border-error/30'
                                : 'bg-success/10 text-success border border-success/30'
                            }`}
                          >
                            {assessment.effectiveClosed ? 'Closed' : 'Open'}
                          </span>
                          {assessment.closeAtDue && (
                            <span className="px-2 py-0.5 rounded text-xs bg-gold/20 text-[#8B6914] border border-gold/40">
                              Auto-close
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-foreground-muted">
                          <span>Due: {formatDate(assessment.dueAt)}</span>
                          <span>{assessment.attemptCount} attempts</span>
                          <span>{assessment.markedCount} marked</span>
                          {assessment.pdfBlobUrl && (
                            <a
                              href={assessment.pdfBlobUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#2D4A6B] hover:underline"
                            >
                              📄 {assessment.pdfFileName || 'View PDF'}
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(assessment.id, assessment.status)}
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            assessment.status === 'OPEN'
                              ? 'bg-error/10 text-error border border-error/30 hover:bg-error/20'
                              : 'bg-success/10 text-success border border-success/30 hover:bg-success/20'
                          }`}
                        >
                          {assessment.status === 'OPEN' ? 'Close' : 'Reopen'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </AuthLayout>
  );
}

