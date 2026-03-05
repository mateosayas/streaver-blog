"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PostWithUser } from "@/types";

type DeletePostDialogProps = {
  post: PostWithUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
};

export function DeletePostDialog({
  post,
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
}: DeletePostDialogProps) {
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
            className="h-9.5 rounded-lg border-[#E5E3DC] px-4.5"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            className="bg-destructive hover:bg-destructive/90 h-9.5 rounded-lg px-4.5 text-white"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting…
              </>
            ) : (
              "Delete post"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
