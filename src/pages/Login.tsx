import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth, Role } from '../lib/auth/AuthContext';
import { GraduationCap } from 'lucide-react';
import { DecorativeSpine, ShelfBoard } from '@/components/bookshelf';

export function Login() {
  const { role: roleParam } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const role: Role = (roleParam?.toUpperCase() as Role) || 'STUDENT';

  const getRoleConfig = () => {
    switch (role) {
      case 'TEACHER':
        return {
          title: 'Teacher Login',
          defaultEmail: 'teacher@wildmind.edu',
          redirectTo: '/teacher/home',
          quick: [{ label: 'Dr. Smith', email: 'teacher@wildmind.edu' }],
        };
      case 'ADMIN':
        return {
          title: 'Admin Login',
          defaultEmail: 'admin@wildmind.edu',
          redirectTo: '/admin',
          quick: [{ label: 'Admin', email: 'admin@wildmind.edu' }],
        };
      default:
        return {
          title: 'Student Login',
          defaultEmail: 'alice@wildmind.edu',
          redirectTo: '/student/home',
          quick: [
            { label: 'Alice', email: 'alice@wildmind.edu' },
            { label: 'Bob', email: 'bob@wildmind.edu' },
            { label: 'Charlie', email: 'charlie@wildmind.edu' },
          ],
        };
    }
  };

  const config = getRoleConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email || config.defaultEmail, password, role);
      navigate(config.redirectTo);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const quickFill = (quickEmail: string) => {
    setEmail(quickEmail);
  };

  return (
    <div className="min-h-screen bg-wood text-parchment relative flex items-center justify-center px-4 overflow-hidden">
      {/* Decorative shelf behind the card */}
      <div className="absolute bottom-[10%] left-8 right-8 sm:left-16 sm:right-16 pointer-events-none select-none">
        <div className="flex items-end justify-between h-[220px] px-4 sm:px-10">
          <div className="flex items-end gap-2">
            <DecorativeSpine label="COMP101" color="#6B2D3C" width={48} height={190} />
            <DecorativeSpine label="WRIT201" color="#2D4A6B" width={54} height={210} />
            <DecorativeSpine label="HIST201" color="#3D5A3A" width={44} height={170} />
          </div>
          <div className="hidden sm:flex items-end gap-2">
            <DecorativeSpine label="Wildmind" color="#8B6914" width={50} height={200} />
            <DecorativeSpine label="Demo" color="#4A3060" width={42} height={160} />
          </div>
        </div>
        <ShelfBoard />
      </div>

      {/* Login page card */}
      <div className="relative z-10 w-full max-w-[400px] bg-page text-ink rounded-[2px] shadow-lg px-9 py-9 mb-16 sm:mb-20">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 bg-secondary text-secondary-foreground flex items-center justify-center rounded-[2px]">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="text-[12px] font-bold tracking-[0.08em] text-ink-muted">
            WILDMIND LIBRARY
          </span>
        </div>

        <h1 className="font-serif text-[28px] font-bold text-ink mt-3 mb-1.5">{config.title}</h1>
        <p className="text-sm text-ink-muted mb-6">Sign in to Wildmind Education</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-[11px] font-bold text-ink-muted tracking-[0.06em] mb-1"
            >
              EMAIL
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={config.defaultEmail}
              className="w-full py-2.5 bg-transparent border-0 border-b-[1.5px] border-ink text-[15px] text-ink outline-none focus:border-gold placeholder:text-ink-subtle"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[11px] font-bold text-ink-muted tracking-[0.06em] mb-1"
            >
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full py-2.5 bg-transparent border-0 border-b-[1.5px] border-ink text-[15px] text-ink outline-none focus:border-gold placeholder:text-ink-subtle"
            />
            <p className="text-xs text-ink-subtle mt-2">(Mock login — any password works)</p>
          </div>

          {error && (
            <div className="bg-error/10 text-error px-3 py-2 rounded-[2px] text-sm border border-error/30">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gold text-primary-foreground font-semibold text-[13px] rounded-[2px] border border-gold hover:brightness-105 disabled:opacity-60"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-[11px] text-ink-subtle mb-2">Quick login (for demo)</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {config.quick.map((q) => (
              <button
                key={q.email}
                type="button"
                onClick={() => quickFill(q.email)}
                className="px-3 py-1.5 text-xs font-semibold text-ink bg-[#F5E6D3] border border-gold rounded-[2px] hover:bg-gold/30"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-ink-subtle">
          {role !== 'STUDENT' && (
            <Link to="/login/student" className="hover:text-ink mx-2">
              Student Login
            </Link>
          )}
          {role !== 'TEACHER' && (
            <Link to="/login/teacher" className="hover:text-ink mx-2">
              Teacher Login
            </Link>
          )}
          {role !== 'ADMIN' && (
            <Link to="/login/admin" className="hover:text-ink mx-2">
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
