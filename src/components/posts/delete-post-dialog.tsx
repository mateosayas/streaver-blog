"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import type { UserPost } from "@/types/posts";

type DeletePostDialogProps = {
  post: UserPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function DeletePostDialog({ post, open, onOpenChange, onConfirm }: DeletePostDialogProps) {
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        mobileFullScreen
        className="gap-6 p-8 max-sm:flex max-sm:flex-col sm:w-110 sm:rounded-[14px] sm:shadow-[0_20px_60px_rgba(28,28,46,0.18)]"
      >
        <div className="flex flex-col gap-3">
          <DialogTitle className="text-foreground text-[18px] leading-snug font-bold tracking-[-0.02em]">
            Delete this post?
          </DialogTitle>
          <DialogDescription asChild>
            <div className="text-muted-foreground flex flex-col gap-1 text-[14px] leading-5.5">
              <p>
                This will remove{" "}
                <strong className="text-foreground font-semibold">{post.title}</strong> from the
                list.
              </p>
              <p>This action cannot be undone.</p>
            </div>
          </DialogDescription>
        </div>

        <DialogFooter className="gap-2 max-sm:mt-auto">
          <Button
            variant="outline"
            className="border-border h-9.5 rounded-lg px-4.5"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-destructive hover:bg-destructive/90 h-9.5 rounded-lg px-4.5 text-white"
            onClick={onConfirm}
          >
            Delete post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
