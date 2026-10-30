import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Eye, CheckCircle } from 'lucide-react';
import { DecorativeSpine, ShelfBoard } from '@/components/bookshelf';

export function Landing() {
  return (
    <div className="min-h-screen bg-wood text-parchment">
      <header className="border-b border-shelf/50">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[2px] bg-gold text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="font-serif font-bold text-lg">Wildmind</div>
              <div className="text-[11px] tracking-[0.08em] text-[#A89070]">EDUCATION LIBRARY</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login/student"
              className="px-3 py-1.5 text-sm font-semibold rounded-[2px] border border-[#8B6914] bg-[#3D2518] text-parchment hover:border-gold"
            >
              Student Login
            </Link>
            <Link
              to="/login/teacher"
              className="px-4 py-1.5 text-sm font-semibold rounded-[2px] bg-gold text-primary-foreground border border-gold hover:brightness-105"
            >
              Teacher Login
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-6 lg:px-16 py-16 lg:py-24">
        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Assessments,
            <br />
            <span className="text-gold">without the noise.</span>
          </h1>
          <p className="text-lg text-[#A89070] mb-10 max-w-xl">
            Write with autosave. Teach with visibility. Grade with confidence — from a quiet library of courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-16">
            <Link
              to="/login/student"
              className="px-5 py-3 text-sm font-semibold rounded-[2px] border border-[#8B6914] bg-[#3D2518] text-parchment text-center hover:border-gold"
            >
              I&apos;m a Student
            </Link>
            <Link
              to="/login/teacher"
              className="px-5 py-3 text-sm font-semibold rounded-[2px] bg-gold text-primary-foreground border border-gold text-center hover:brightness-105"
            >
              I&apos;m a Teacher
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-20">
          {[
            {
              icon: BookOpen,
              title: 'Open assessments with autosave',
              body: 'Write freely with AI assistance. Your work saves automatically — never lose progress.',
            },
            {
              icon: Eye,
              title: 'Teachers track progress instantly',
              body: "See student work in real-time. Know who's on track and who needs help.",
            },
            {
              icon: CheckCircle,
              title: 'Marks are locked and clear',
              body: 'Simple 0–100 marking. Students see exactly where they stand.',
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-page text-ink rounded-[2px] shadow p-6">
              <div className="w-10 h-10 bg-[#F0E8D8] rounded-[2px] flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-secondary" />
              </div>
              <h3 className="font-serif font-bold text-lg mb-2">{title}</h3>
              <p className="text-sm text-ink-muted">{body}</p>
            </div>
          ))}
        </div>

        {/* Decorative shelf */}
        <div className="mt-8">
          <div className="flex items-end gap-2 h-[160px] px-4">
            <DecorativeSpine label="COMP101" color="#6B2D3C" width={44} height={140} />
            <DecorativeSpine label="WRIT201" color="#2D4A6B" width={48} height={155} />
            <DecorativeSpine label="HIST201" color="#3D5A3A" width={40} height={125} />
            <DecorativeSpine label="Wildmind" color="#8B6914" width={46} height={148} />
          </div>
          <ShelfBoard />
        </div>
      </main>

      <footer className="border-t border-shelf/40 py-6 text-center text-sm text-[#A89070]">
        © {new Date().getFullYear()} Wildmind Education
      </footer>
    </div>
  );
}
