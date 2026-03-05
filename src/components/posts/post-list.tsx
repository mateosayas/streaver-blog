"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { PostCard } from "@/components/posts/post-card";
import { DeletePostDialog } from "@/components/posts/delete-post-dialog";
import { Button } from "@/components/ui/button";
import { deletePost } from "@/lib/api";
import type { PostWithUser } from "@/types";

type PostListProps = {
  initialPosts: PostWithUser[];
  hasFilter?: boolean;
}

export function PostList({ initialPosts, hasFilter = false }: PostListProps) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [postToDelete, setPostToDelete] = useState<PostWithUser | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  const handleDeleteRequest = (id: number) => {
    const post = posts.find((p) => p.id === id);
    if (!post || deletingIds.has(id)) return;
    setPostToDelete(post);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;

    setIsDeleting(true);
    setDeletingIds((prev) => new Set(prev).add(postToDelete.id));

    const result = await deletePost(postToDelete.id);

    if (result.success) {
      setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
      router.refresh();
      setIsDialogOpen(false);
      setPostToDelete(null);
    }

    setIsDeleting(false);
    setDeletingIds((prev) => {
      const next = new Set(prev);
      next.delete(postToDelete.id);
      return next;
    });
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open && !isDeleting) {
      setIsDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const handleViewAll = () => {
    router.push("/posts");
  };

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-5">
        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[12px] bg-[#F0EEE9]">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[17px] font-bold tracking-[-0.02em] text-foreground">
            No posts found
          </p>
          <p className="text-[14px] leading-[21px] text-muted-foreground max-w-[240px]">
            {hasFilter
              ? "No posts match this filter. Try selecting a different author."
              : "There are no posts to display."}
          </p>
        </div>
        {hasFilter && (
          <Button variant="outline" className="h-9 rounded-lg px-[18px] border-[#E5E3DC]" onClick={handleViewAll}>
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
          />
        ))}
      </div>

      <DeletePostDialog
        post={postToDelete}
        open={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
