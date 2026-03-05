import { getPosts, getUsers } from "@/lib/data/posts";
import { PostList } from "@/components/post-list";
import { ALL_USERS_VALUE, PostsFilter } from "@/components/posts-filter";
import { SiteHeader } from "@/components/site-header";

type PostsPageProps = {
  searchParams: Promise<{ userId?: string }>;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { userId: rawUserId } = await searchParams;
  const userId = rawUserId ? Number(rawUserId) : undefined;

  const [posts, users] = await Promise.all([
    getPosts(isNaN(userId as number) ? undefined : userId),
    getUsers(),
  ]);

  const postListKey = userId ?? ALL_USERS_VALUE;

  const activeUser = userId
    ? users.find((u) => u.id === userId)
    : null;

  const filterLabel = activeUser ? `${activeUser.name}'s Posts` : "All Posts";
  const filterSubtitle = activeUser
    ? `Showing ${posts.length} post${posts.length !== 1 ? "s" : ""} from ${activeUser.name}`
    : `Showing ${posts.length} posts from all authors`;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1280px] px-4 sm:px-8 lg:px-20 py-10">
        {/* Filter bar */}
        <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
          {/* Title section */}
          <div>
            <div className="flex items-center justify-between lg:block">
              <h1 className="text-[22px] font-extrabold leading-7 tracking-[-0.04em] text-foreground lg:text-[32px] lg:leading-10">
                {filterLabel}
              </h1>
              {/* Post count — mobile only */}
              <span className="text-[12px] text-muted-foreground lg:hidden">
                {posts.length} posts
              </span>
            </div>
            {/* Subtitle — desktop only */}
            <p className="hidden text-[14px] text-muted-foreground lg:block">
              {filterSubtitle}
            </p>
          </div>

          <PostsFilter users={users} />
        </div>

        <PostList key={postListKey} initialPosts={posts} hasFilter={!!userId} />
      </main>
    </>
  );
}
