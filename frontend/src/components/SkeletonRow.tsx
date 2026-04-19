'use client';

export default function SkeletonRow() {
  return (
    <div className="space-y-4 px-6 lg:px-16 container-max mx-auto mb-12 animate-pulse">
      <div className="h-8 w-48 bg-white/5 rounded-md mb-6" />
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="min-w-[320px] aspect-[16/9] bg-white/5 rounded-xl border border-white/5 relative overflow-hidden">
             <div className="absolute inset-x-0 bottom-0 p-4 space-y-2">
                <div className="h-3 w-20 bg-white/10 rounded" />
                <div className="h-5 w-40 bg-white/10 rounded" />
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
