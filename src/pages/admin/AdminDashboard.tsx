import { useState, useEffect } from 'react';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { getAuthHeaders } from '../../lib/auth/AuthContext';

interface Stats {
  userCount: number;
  courseCount: number;
  assessmentCount: number;
  attemptCount: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface Course {
  id: string;
  code: string;
  title: string;
  term: string;
  status: string;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'courses'>('users');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, coursesRes] = await Promise.all([
        fetch('/api/admin/stats', { headers: getAuthHeaders() }),
        fetch('/api/admin/users', { headers: getAuthHeaders() }),
        fetch('/api/admin/courses', { headers: getAuthHeaders() }),
      ]);

      if (!statsRes.ok || !usersRes.ok || !coursesRes.ok) {
        throw new Error('Failed to fetch admin data');
      }

      const [statsData, usersData, coursesData] = await Promise.all([
        statsRes.json(),
        usersRes.json(),
        coursesRes.json(),
      ]);

      setStats(statsData);
      setUsers(usersData.users);
      setCourses(coursesData.courses);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-foreground-muted">Loading admin dashboard...</div>
        </div>
      </AuthLayout>
    );
  }

  if (error) {
    return (
      <AuthLayout>
        <div className="bg-error/10 text-error border border-error/30 p-4 rounded-[2px]">
          {error}
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-ink mb-2">Admin Dashboard</h1>
          <p className="text-foreground-muted">Manage users, courses, and assessments</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-page rounded-[2px] border border-[#E0D4C0] p-4">
              <div className="text-2xl font-bold text-ink">{stats.userCount}</div>
              <div className="text-sm text-foreground-muted">Users</div>
            </div>
            <div className="bg-page rounded-[2px] border border-[#E0D4C0] p-4">
              <div className="text-2xl font-bold text-ink">{stats.courseCount}</div>
              <div className="text-sm text-foreground-muted">Courses</div>
            </div>
            <div className="bg-page rounded-[2px] border border-[#E0D4C0] p-4">
              <div className="text-2xl font-bold text-ink">{stats.assessmentCount}</div>
              <div className="text-sm text-foreground-muted">Assessments</div>
            </div>
            <div className="bg-page rounded-[2px] border border-[#E0D4C0] p-4">
              <div className="text-2xl font-bold text-ink">{stats.attemptCount}</div>
              <div className="text-sm text-foreground-muted">Attempts</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 border-b border-[#E0D4C0]">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-2 px-1 font-medium ${
              activeTab === 'users'
                ? 'border-b-2 border-red-500 text-red-600'
                : 'text-foreground-muted hover:text-parchment'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`pb-2 px-1 font-medium ${
              activeTab === 'courses'
                ? 'border-b-2 border-red-500 text-red-600'
                : 'text-foreground-muted hover:text-parchment'
            }`}
          >
            Courses ({courses.length})
          </button>
        </div>

        {/* Users tab */}
        {activeTab === 'users' && (
          <section>
            <div className="bg-page rounded-[2px] border border-[#E0D4C0] overflow-hidden">
              <table className="w-full">
                <thead className="bg-page-muted">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Name</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Email</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Role</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0D4C0]">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-page-muted">
                      <td className="px-4 py-3 font-medium text-ink">{user.name}</td>
                      <td className="px-4 py-3 text-foreground-muted">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          user.role === 'ADMIN' ? 'bg-error/10 text-error border border-error/30' :
                          user.role === 'TEACHER' ? 'bg-purple-100 text-purple-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          user.status === 'ACTIVE' ? 'bg-success/10 text-success border border-success/30' : 'bg-page-muted text-foreground-muted'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Courses tab */}
        {activeTab === 'courses' && (
          <section>
            <div className="bg-page rounded-[2px] border border-[#E0D4C0] overflow-hidden">
              <table className="w-full">
                <thead className="bg-page-muted">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Code</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Title</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Term</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0D4C0]">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-page-muted">
                      <td className="px-4 py-3 font-medium text-ink">{course.code}</td>
                      <td className="px-4 py-3 text-foreground-muted">{course.title}</td>
                      <td className="px-4 py-3 text-foreground-muted">{course.term}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          course.status === 'CURRENT' ? 'bg-success/10 text-success border border-success/30' : 'bg-page-muted text-foreground-muted'
                        }`}>
                          {course.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </AuthLayout>
  );
}

