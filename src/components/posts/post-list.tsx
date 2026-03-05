"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import { PostCard } from "@/components/posts/post-card";
import { DeletePostDialog } from "@/components/posts/delete-post-dialog";
import { Button } from "@/components/ui/button";
import { deletePost } from "@/lib/api";
import { useOnlineStatus } from "@/hooks/use-online-status";
import type { PostWithUser } from "@/types";

type PostListProps = {
  initialPosts: PostWithUser[];
  hasFilter?: boolean;
};

export function PostList({ initialPosts, hasFilter = false }: PostListProps) {
  const router = useRouter();
  const { isOnline } = useOnlineStatus();

  const [posts, setPosts] = useState(initialPosts);
  const [postToDelete, setPostToDelete] = useState<PostWithUser | null>(null);
  // Tracks in-flight deletions to disable the delete button on affected cards and prevent double-deletion
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  const handleDeleteRequest = (id: number) => {
    const post = posts.find((p) => p.id === id);
    if (!post || deletingIds.has(id)) return;
    setPostToDelete(post);
  };

  const handleConfirmDelete = async (postId: number) => {
    const postIndex = posts.findIndex((p) => p.id === postId);
    const removedPost = posts[postIndex];
    if (!removedPost || postIndex === -1) return;

    // Optimistic: close dialog and remove card immediately
    setDeletingIds((prev) => new Set(prev).add(postId));
    setPostToDelete(null);
    setPosts((prev) => prev.filter((p) => p.id !== postId));

    const result = await deletePost(postId);

    setDeletingIds((prev) => {
      const next = new Set(prev);
      next.delete(postId);
      return next;
    });

    if (result.success) {
      toast.success("Post deleted successfully");
      // Sync server cache so stale data never reappears after navigation or filter changes
      return router.refresh();
    }

    // Rollback: re-insert at original position
    setPosts((prev) => {
      const updated = [...prev];
      updated.splice(postIndex, 0, removedPost);
      return updated;
    });

    toast.error("Failed to delete post", {
      description: result.error?.message,
      action: {
        label: "Retry",
        onClick: () => handleConfirmDelete(postId),
      },
    });
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) setPostToDelete(null);
  };

  const handleViewAll = () => {
    router.push("/posts");
  };

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
        <div className="flex h-13 w-13 items-center justify-center rounded-[12px] bg-[#F0EEE9]">
          <FileText className="text-muted-foreground h-6 w-6" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-foreground text-[17px] font-bold tracking-[-0.02em]">No posts found</p>
          <p className="text-muted-foreground max-w-60 text-[14px] leading-5.25">
            {hasFilter
              ? "No posts match this filter. Try selecting a different author."
              : "There are no posts to display."}
          </p>
        </div>
        {hasFilter && (
          <Button
            variant="outline"
            className="h-9 rounded-lg border-[#E5E3DC] px-4.5"
            onClick={handleViewAll}
          >
            View all posts
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onDelete={handleDeleteRequest}
            isDeleting={deletingIds.has(post.id)}
            disabled={!isOnline}
          />
        ))}
      </div>

      <DeletePostDialog
        post={postToDelete}
        open={postToDelete !== null}
        onOpenChange={handleDialogOpenChange}
        onConfirm={() => postToDelete && handleConfirmDelete(postToDelete.id)}
        isDeleting={false}
      />
    </>
  );
}
