import { Skeleton } from "@/components/ui/skeleton"

export function IssueCardSkeleton() {
  return (
    <div className="space-y-3 p-4 bg-gradient-to-br from-slate-800/60 via-slate-900/40 to-slate-900/60 rounded-xl border border-slate-700/50">
      <Skeleton className="h-1.5 w-full rounded-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex justify-between pt-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}

export function IssueCardSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 p-6 rounded-2xl border border-white/5">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="space-y-2 p-4 rounded-xl bg-white/5 border border-white/10">
          <IssueCardSkeleton />
        </div>
      ))}
    </div>
  )
}
