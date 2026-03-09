import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PostCardSkeleton() {
  return (
    <Card className="flex flex-col gap-3.5 p-6">
      {/* Header: avatar + delete button */}
      <CardHeader className="flex flex-row items-center justify-between p-0">
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-7 w-7 rounded-md" />
      </CardHeader>

      {/* Content: title + body */}
      <CardContent className="flex flex-col gap-2 p-0">
        <Skeleton className="h-5 w-4/5" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </CardContent>

      {/* Footer: post ID */}
      <CardFooter className="border-secondary border-t p-0 pt-1">
        <Skeleton className="h-3 w-14" />
      </CardFooter>
    </Card>
  );
}
