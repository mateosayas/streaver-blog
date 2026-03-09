import { PostCardSkeleton } from "@/components/posts/post-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function PostsLoading() {
  return (
    <>
      {/* Filter bar */}
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
        <div>
          <div className="flex items-center justify-between lg:block">
            <Skeleton className="h-7 w-32 lg:h-10 lg:w-44" />
            <Skeleton className="h-4 w-16 lg:hidden" />
          </div>
          <Skeleton className="mt-1 hidden h-4 w-56 lg:block" />
        </div>
        <Skeleton className="h-10 w-full lg:w-52" />
      </div>

      {/* Post grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}
