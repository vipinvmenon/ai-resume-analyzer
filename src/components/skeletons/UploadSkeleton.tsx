/**
 * Skeleton loader for upload card
 */
export default function UploadSkeleton() {
  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-8 animate-pulse">
      <div className="rounded-xl border border-dashed border-white/20 p-10">
        <div className="mx-auto mb-6 h-14 w-14 rounded-full bg-white/10"></div>
        <div className="mx-auto mb-2 h-6 w-48 rounded bg-white/10"></div>
        <div className="mx-auto h-4 w-32 rounded bg-white/10"></div>
        <div className="mt-3 flex items-center justify-center gap-3">
          <div className="h-6 w-16 rounded-md bg-white/10"></div>
          <div className="h-6 w-16 rounded-md bg-white/10"></div>
        </div>
      </div>
    </div>
  );
}

