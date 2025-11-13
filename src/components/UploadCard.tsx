import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
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

  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-8 text-white shadow-[0_0_40px_rgba(59,130,246,0.15)]">
      <div
        className={`rounded-xl border border-dashed p-10 text-center ${
          dragOver ? 'border-blue-400 bg-blue-500/10' : 'border-white/20'
        }`}
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
            <div className="mx-auto h-4 w-32 rounded bg-white/10 animate-pulse"></div>
          </>
        ) : (
          <>
            <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-blue-500/15 text-2xl text-blue-300">
              ⬆️
            </div>
            <p className="text-lg font-medium">
              {UI_MESSAGES.UPLOAD_DRAG_DROP}
            </p>
          </>
        )}
        <p className="mt-2 text-sm text-white/60">Supported formats:</p>
        <div className="mt-3 flex items-center justify-center gap-3 text-xs">
          <span className="rounded-md bg-white/10 px-2 py-1">{FILE_TYPE_LABELS.PDF}</span>
          <span className="rounded-md bg-white/10 px-2 py-1">{FILE_TYPE_LABELS.DOCX}</span>
        </div>
        {resume && (
          <div className="mt-5">
            <p className="text-sm text-white/80">Selected: {resume.name}</p>
            {/* {resume.content && (
              <div className="mt-1">
                {resume.type === 'application/pdf' ? (
                  <p className="text-xs text-yellow-300">
                    ⚠ PDF uploaded (text extraction in progress)
                  </p>
                ) : (
                  <p className="text-xs text-green-300">✓ Text extracted successfully</p>
                )}
              </div>
            )} */}
          </div>
        )}
        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          className="rounded-md border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/5"
          onClick={() => router.push('/')}
        >
          {UI_MESSAGES.UPLOAD_BACK}
        </button>
        <button
          disabled={!resume || isProcessing}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white ${
            resume && !isProcessing
              ? 'bg-blue-600 hover:bg-blue-500'
              : 'bg-white/10 text-white/40'
          }`}
          onClick={() => router.push('/job')}
        >
          {isProcessing ? 'Processing...' : UI_MESSAGES.UPLOAD_CONTINUE}
        </button>
      </div>
    </div>
  );
}
