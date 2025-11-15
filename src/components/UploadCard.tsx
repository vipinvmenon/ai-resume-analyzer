'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { UploadCloud, ArrowLeft, ArrowRight, CheckCircle2, X, FileText } from 'lucide-react';
import { useChromaGrid } from '@/hooks/useChromaGrid';
import ChromaGridOverlay from './ChromaGridOverlay';
import { useAnalysis } from '@/context/AnalysisContext';
import { extractTextFromFile } from '@/utils/file-parser';
import { ACCEPTED_FILE_TYPES, FILE_TYPE_LABELS, UI_MESSAGES } from '@/lib/constants';
import { isAcceptedFileType } from '@/lib/file-types';

/**
 * Validates if a file is of an accepted type
 */
function validateFileType(file: File): boolean {
  return isAcceptedFileType(file.type);
}

export default function UploadCard() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { rootRef, fadeRef, handleMove, handleLeave, handleCardMove } = useChromaGrid();
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { setResume, resume } = useAnalysis();
  const router = useRouter();

  async function handleFileUpload(files: FileList | null) {
    setError(null);
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!validateFileType(file)) {
      setError(`Only ${FILE_TYPE_LABELS.PDF} or ${FILE_TYPE_LABELS.DOCX} files are supported`);
      return;
    }

    setIsProcessing(true);
    try {
      const content = await extractTextFromFile(file);

      setResume({
        name: file.name,
        size: file.size,
        type: file.type,
        content,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  }

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResume(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <ChromaGridOverlay
      rootRef={rootRef}
      fadeRef={fadeRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="mx-auto mt-10 max-w-3xl rounded-2xl border border-blue-400/30 backdrop-blur p-8 text-white shadow-[0_0_40px_rgba(59,130,246,0.15)]"
      radius="300px"
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
        }}
        className="absolute inset-0 rounded-2xl"
      />
      <div
        onMouseMove={handleCardMove}
        className={`group relative rounded-xl border border-dashed p-10 text-center overflow-hidden transition-colors duration-300 ${
          resume ? 'border-green-400/50' : dragOver ? 'border-blue-400' : 'border-white/20'
        } cursor-pointer`}
        style={{
          '--spotlight-color': 'rgba(255,255,255,0.05)',
        } as React.CSSProperties}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFileUpload(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        {/* Spotlight effect */}
        {!resume && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-20 opacity-0 group-hover:opacity-100"
            style={{
              background:
                'radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%)',
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10">
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={ACCEPTED_FILE_TYPES.join(',')}
            onChange={(e) => handleFileUpload(e.target.files)}
          />

          {isProcessing ? (
            <>
              <div className="mx-auto mb-6 h-14 w-14 rounded-full bg-white/10 animate-pulse"></div>
              <div className="mx-auto mb-2 h-6 w-48 rounded bg-white/10 animate-pulse"></div>
              <div className="mx-auto mb-2 h-4 w-64 rounded bg-white/10 animate-pulse"></div>
              <div className="mx-auto mb-2 h-4 w-96 rounded bg-white/10 animate-pulse"></div>
              <div className="mx-auto h-4 w-64 rounded bg-white/10 animate-pulse"></div>

            </>
          ) : resume ? (
            <>
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-green-500/20 text-green-300">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <p className="text-lg font-medium text-green-300 mb-2">Resume Uploaded</p>
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-white/80">
                <FileText className="h-4 w-4" />
                <span className="truncate max-w-xs">{resume.name}</span>
                <button
                  onClick={handleRemoveFile}
                  className="ml-2 rounded-md p-1 hover:bg-red-500 transition-colors group cursor-pointer"
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4 text-red-400 group-hover:text-white transition-colors" />
                </button>
              </div>
              <p className="mt-2 text-xs text-white/60">
                Click to replace or drag a new file
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-blue-500/15 text-blue-300">
                <UploadCloud className="h-7 w-7" />
              </div>
              <p className="text-lg font-medium">
                {UI_MESSAGES.UPLOAD_DRAG_DROP}
              </p>
              <p className="mt-2 text-sm text-white/60">Supported formats:</p>
              <div className="mt-3 flex items-center justify-center gap-3 text-xs">
                <span className="rounded-md bg-white/10 px-2 py-1">{FILE_TYPE_LABELS.PDF}</span>
                <span className="rounded-md bg-white/10 px-2 py-1">{FILE_TYPE_LABELS.DOCX}</span>
              </div>
            </>
          )}
          {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        </div>
      </div>

      <div className="relative z-50 mt-6 flex items-center justify-between">
        <button
          className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/5 cursor-pointer"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="h-4 w-4" />
          {UI_MESSAGES.UPLOAD_BACK}
        </button>
        <button
          disabled={!resume || isProcessing}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white ${
            resume && !isProcessing
              ? 'bg-blue-600 hover:bg-blue-500 cursor-pointer'
              : 'bg-white/10 text-white/40 cursor-not-allowed'
          }`}
          onClick={() => router.push('/job')}
        >
          {isProcessing ? 'Processing...' : UI_MESSAGES.UPLOAD_CONTINUE}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </ChromaGridOverlay>
  );
}
