import { useState, useEffect, useCallback } from 'react';
import { EditorPane } from '../Editor/EditorPane';
import { ChatPane } from '../Chat/ChatPane';
import { SubmissionModal } from '../SubmissionModal/SubmissionModal';
import type { AssessmentSession, ChatMessage, InsertionEvent, SubmissionSnapshot } from '../../types/assessment';
import type { JSONContent } from '@tiptap/core';

export interface AssessmentWorkspaceProps {
  assessmentId: string;
  assessmentTitle?: string;
  courseCode?: string;
  studentName?: string;
  mode: 'student' | 'teacher';
  readOnly: boolean;
  effectiveClosed: boolean;
  initialSession: AssessmentSession;
  onAutosave?: (session: AssessmentSession) => Promise<void>;
  mark?: number | null;
  onSetMark?: (mark: number) => Promise<void>;
  pdfUrl?: string | null;
  pdfFileName?: string | null;
  onBack?: () => void;
}

export function AssessmentWorkspace({
  assessmentId,
  assessmentTitle,
  courseCode,
  studentName,
  mode,
  readOnly,
  effectiveClosed,
  initialSession,
  onAutosave,
  mark,
  onSetMark,
  pdfUrl,
  pdfFileName,
  onBack,
}: AssessmentWorkspaceProps) {
  const [session, setSession] = useState<AssessmentSession>(initialSession);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [markInput, setMarkInput] = useState<string>(mark?.toString() ?? '');
  const [markError, setMarkError] = useState<string | null>(null);

  useEffect(() => {
    setSession(initialSession);
  }, [initialSession]);

  useEffect(() => {
    setMarkInput(mark?.toString() ?? '');
  }, [mark]);

  useEffect(() => {
    if (readOnly || !onAutosave) return;

    const saveTimeout = setTimeout(async () => {
      setIsSaving(true);
      try {
        await onAutosave(session);
        setLastSaved(new Date());
      } catch (error) {
        console.error('Autosave failed:', error);
      } finally {
        setIsSaving(false);
      }
    }, 2000);

    return () => clearTimeout(saveTimeout);
  }, [session, readOnly, onAutosave]);

  const handleDocumentChange = useCallback((content: JSONContent) => {
    if (readOnly) return;
    setSession(prev => ({
      ...prev,
      documentContent: content,
    }));
  }, [readOnly]);

  const handleNewMessage = useCallback((message: ChatMessage) => {
    if (readOnly) return;
    setSession(prev => ({
      ...prev,
      chatHistory: [...prev.chatHistory, message],
    }));
  }, [readOnly]);

  const handleInsertText = useCallback((text: string, aiMessageId: string) => {
    if (readOnly) return;
    const insertion: InsertionEvent = {
      id: `ins_${Date.now()}_${Math.random()}`,
      aiMessageId,
      insertedText: text,
      createdAt: Date.now(),
    };

    setSession(prev => ({
      ...prev,
      insertions: [...prev.insertions, insertion],
    }));
  }, [readOnly]);

  const handleSubmit = () => {
    if (session.submittedAt || readOnly) return;

    const snapshot: SubmissionSnapshot = {
      documentContent: session.documentContent,
      chatHistory: session.chatHistory,
      insertions: session.insertions,
    };

    const updatedSession: AssessmentSession = {
      ...session,
      submittedAt: Date.now(),
      submission: snapshot,
    };

    setSession(updatedSession);
    if (onAutosave) {
      onAutosave(updatedSession);
    }
    setShowSubmissionModal(true);
  };

  const handleDownloadJSON = () => {
    if (!session.submission) return;

    const dataStr = JSON.stringify(session.submission, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `submission_${assessmentId}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleMarkSubmit = async () => {
    if (!onSetMark) return;

    const markValue = parseInt(markInput, 10);
    if (isNaN(markValue) || markValue < 0 || markValue > 100) {
      setMarkError('Mark must be an integer between 0 and 100');
      return;
    }

    setMarkError(null);
    try {
      await onSetMark(markValue);
    } catch (error) {
      setMarkError('Failed to save mark');
    }
  };

  const isSubmitted = !!session.submittedAt;
  const isStudentMode = mode === 'student';
  const isTeacherMode = mode === 'teacher';

  const statusBadge = () => {
    if (effectiveClosed) {
      return (
        <span className="badge inline-block px-2 py-0.5 text-[11px] font-bold tracking-wide border border-error text-error rounded-[2px]">
          Closed
        </span>
      );
    }
    if (isSubmitted) {
      return (
        <span className="badge inline-block px-2 py-0.5 text-[11px] font-bold tracking-wide border border-success text-success rounded-[2px]">
          Submitted
        </span>
      );
    }
    if (isTeacherMode) {
      return (
        <span className="badge inline-block px-2 py-0.5 text-[11px] font-bold tracking-wide border border-gold text-gold rounded-[2px]">
          Teacher View
        </span>
      );
    }
    return (
      <span className="badge inline-block px-2 py-0.5 text-[11px] font-bold tracking-wide border border-success text-success rounded-[2px]">
        Open
      </span>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-wood text-parchment">
      {/* Header */}
      <header className="px-4 sm:px-8 py-3 flex items-center justify-between gap-3 flex-wrap shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-[2px] border border-[#8B6914] bg-[#3D2518] text-parchment hover:border-gold"
            >
              ← Back
            </button>
          )}
          <h1 className="font-serif text-lg font-bold truncate">
            {assessmentTitle || 'Assessment'}
          </h1>
          {statusBadge()}
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {isSaving && <span className="text-xs text-[#A89070]">Saving...</span>}
          {lastSaved && !isSaving && (
            <span className="text-xs text-[#A89070]">
              Last saved: {lastSaved.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </span>
          )}

          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-semibold rounded-[2px] border border-[#8B6914] bg-[#3D2518] text-parchment hover:border-gold"
            >
              {pdfFileName || 'View PDF'}
            </a>
          )}

          {mark !== undefined && mark !== null && isStudentMode && (
            <span className="badge inline-block px-2 py-0.5 text-[11px] font-bold tracking-wide border border-gold text-gold rounded-[2px]">
              Mark: {mark}/100
            </span>
          )}

          {isTeacherMode && onSetMark && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                value={markInput}
                onChange={(e) => setMarkInput(e.target.value)}
                placeholder="0-100"
                className="w-16 px-2 py-1 border border-[#8B6914] rounded-[2px] text-center bg-[#3D2518] text-parchment text-sm"
              />
              <button
                onClick={handleMarkSubmit}
                className="px-3 py-1.5 text-xs font-semibold rounded-[2px] bg-gold text-primary-foreground border border-gold hover:brightness-105"
              >
                Set Mark
              </button>
              {markError && <span className="text-error text-xs">{markError}</span>}
            </div>
          )}

          {isStudentMode && !readOnly && !isSubmitted && (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-[13px] font-semibold rounded-[2px] bg-gold text-primary-foreground border border-gold hover:brightness-105"
            >
              Submit Assessment
            </button>
          )}

          {isSubmitted && (
            <button
              onClick={handleDownloadJSON}
              className="px-4 py-2 text-[13px] font-semibold rounded-[2px] border border-[#8B6914] bg-[#3D2518] text-parchment hover:border-gold"
            >
              Download JSON
            </button>
          )}
        </div>
      </header>

      {effectiveClosed && (
        <div className="mx-4 sm:mx-8 mb-2 px-4 py-2 text-sm rounded-[2px] bg-error/10 border border-error/30 text-error">
          This assessment is closed.{' '}
          {isStudentMode
            ? 'You can view your work but cannot make changes.'
            : 'The student can no longer make changes.'}
        </div>
      )}

      {/* Open book spread */}
      <div className="flex-1 flex min-h-0 px-3 sm:px-6 pb-4 gap-0">
        {/* LEFT PAGE: essay */}
        <div className="flex-1 min-w-0 bg-page text-ink rounded-l-[4px] shadow-[8px_0_24px_rgba(0,0,0,0.2)] relative overflow-hidden flex flex-col">
          <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-r from-transparent to-black/5 pointer-events-none" />
          <div className="px-6 sm:px-10 pt-5 pb-2 flex justify-between items-center text-[11px] text-ink-subtle shrink-0">
            <span>
              {[studentName, courseCode].filter(Boolean).join(' · ') || 'Essay'}
            </span>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <EditorPane
              content={session.documentContent}
              onChange={handleDocumentChange}
              onInsertText={handleInsertText}
              readOnly={readOnly || effectiveClosed}
              variant="book"
            />
          </div>
        </div>

        {/* Binding gutter */}
        <div
          className="w-5 sm:w-6 shrink-0 shadow-[inset_0_0_12px_rgba(0,0,0,0.15)]"
          style={{
            background: 'linear-gradient(90deg, #D4C4A8, #C4B090 40%, #D4C4A8)',
          }}
          aria-hidden
        />

        {/* RIGHT PAGE: AI tutor notes */}
        <div className="flex-1 min-w-0 max-w-[520px] bg-page text-ink rounded-r-[4px] shadow-[-8px_0_24px_rgba(0,0,0,0.15)] relative overflow-hidden flex flex-col">
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-l from-transparent to-black/5 pointer-events-none" />
          <ChatPane
            messages={session.chatHistory}
            onNewMessage={handleNewMessage}
            onInsertText={handleInsertText}
            readOnly={readOnly || effectiveClosed}
            courseCode={courseCode}
            variant="book"
          />
        </div>
      </div>

      {showSubmissionModal && session.submission && (
        <SubmissionModal
          submission={session.submission}
          onClose={() => setShowSubmissionModal(false)}
          onDownload={handleDownloadJSON}
        />
      )}
    </div>
  );
}
