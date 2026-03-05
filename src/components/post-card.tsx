import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { PostWithUser } from "@/types";
import { truncateText } from "@/utils/truncate";
import { getInitials } from "@/utils/initials";

interface PostCardProps {
  post: PostWithUser;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

export function PostCard({ post, onDelete, isDeleting = false }: PostCardProps) {
  return (
    <Card
      className={cn(
        "flex flex-col gap-3.5 transition-opacity",
        isDeleting && "opacity-50"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between p-0">
        {/* Author */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-700 text-[11px] font-bold text-white">
            {getInitials(post.user.name)}
          </div>
          <span className="text-[13px] font-medium text-foreground">
            {post.user.name}
          </span>
        </div>

        {/* Delete button */}
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive hover:border-destructive/40"
          onClick={() => onDelete(post.id)}
          disabled={isDeleting}
          aria-label={`Delete post: ${post.title}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 p-0">
        <h3 className="text-[16px] font-bold leading-snug tracking-tight text-foreground">
          {post.title}
        </h3>
        <p className="text-[14px] leading-relaxed text-muted-foreground">
          {truncateText(post.body)}
        </p>
      </CardContent>

      <CardFooter className="border-t border-border/50 p-0 pt-1">
        <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/60">
          Post #{post.id}
        </span>
      </CardFooter>
    </Card>
  );
}
