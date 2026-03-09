import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { UserPost } from "@/types/posts";
import { getInitials } from "@/utils/initials";

type PostCardProps = {
  post: UserPost;
  isDeleting?: boolean;
  disabled?: boolean;
  canDelete?: boolean;
  onDelete: (id: number) => void;
};

export function PostCard({
  post,
  onDelete,
  isDeleting = false,
  disabled = false,
  canDelete = false,
}: PostCardProps) {
  return (
    <Card
      className={cn(
        "flex flex-col gap-3.5 p-6 transition-all hover:-translate-y-0.5 hover:shadow-md",
        isDeleting && "opacity-50"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between p-0">
        {/* Author */}
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold">
            {getInitials(post.user.name)}
          </div>
          <span className="text-foreground text-[13px] font-medium">{post.user.name}</span>
        </div>

        {/* Delete button */}
        {canDelete && (
          <Button
            variant="outline"
            size="icon"
            className="text-muted-foreground hover:text-destructive hover:border-destructive/40 h-7 w-7 shrink-0 cursor-pointer"
            onClick={() => onDelete(post.id)}
            disabled={isDeleting || disabled}
            aria-label={`Delete post: ${post.title}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-2 p-0">
        <h2 className="text-foreground text-[16px] leading-snug font-bold tracking-[-0.02em]">
          {post.title}
        </h2>
        <p className="text-muted-foreground line-clamp-3 text-[14px] leading-relaxed">
          {post.body}
        </p>
      </CardContent>

      <CardFooter className="border-secondary border-t p-0 pt-1">
        <span className="text-muted-foreground text-[11px] font-medium tracking-[0.06em] uppercase">
          Post #{post.id}
        </span>
      </CardFooter>
    </Card>
  );
}
