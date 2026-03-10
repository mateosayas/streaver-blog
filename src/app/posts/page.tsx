import { auth } from "@/lib/auth";
import { getPosts, getUsers } from "@/lib/data/posts";
import { PostList } from "@/components/posts/post-list";
import { ALL_USERS_VALUE, PostsFilter } from "@/components/posts/posts-filter";
import { iife } from "@/utils/iife";
import { pluralize } from "@/utils/pluralize";

type PostsPageProps = {
  searchParams: Promise<{ userId?: string }>;
};

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { userId: rawUserId } = await searchParams;
  const parsed = rawUserId ? Number(rawUserId) : NaN;
  const userId = isNaN(parsed) ? undefined : parsed;

  const [posts, users, session] = await Promise.all([getPosts(userId), getUsers(), auth()]);

  const postListKey = userId ?? ALL_USERS_VALUE;

  const activeUser = userId ? users.find((u) => u.id === userId) : null;
  const isOwnPosts = !!activeUser && session?.user?.id === String(activeUser.id);

  const authorLabel = iife(() => {
    if (!activeUser) return "all authors";

    return isOwnPosts ? "you" : activeUser.name;
  });

  const filterLabel = iife(() => {
    if (!activeUser) return "All Posts";
    if (isOwnPosts) return "Your Posts";

    return `${activeUser.name}'s Posts`;
  });

  const filterSubtitle = `Showing ${pluralize(posts.length, "post")} from ${authorLabel}`;

  return (
    <>
      {/* Filter bar */}
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
        {/* Title section */}
        <div>
          <div className="flex items-center justify-between lg:block">
            <h1 className="text-foreground text-[22px] leading-7 font-extrabold tracking-[-0.04em] lg:text-[32px] lg:leading-10">
              {filterLabel}
            </h1>
            {/* Post count — mobile only */}
            <span className="text-muted-foreground text-[12px] lg:hidden">
              {pluralize(posts.length, "post")}
            </span>
          </div>
          {/* Subtitle — desktop only */}
          <p className="text-muted-foreground hidden text-[14px] lg:block">{filterSubtitle}</p>
        </div>

        <PostsFilter users={users} />
      </div>

      <PostList key={postListKey} initialPosts={posts} hasFilter={!!userId} />
    </>
  );
}
