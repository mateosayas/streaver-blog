import { getPosts, getUsers } from "@/lib/data/posts";
import { PostList } from "@/components/posts/post-list";
import { ALL_USERS_VALUE, PostsFilter } from "@/components/posts/posts-filter";

type PostsPageProps = {
  searchParams: Promise<{ userId?: string }>;
};

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { userId: rawUserId } = await searchParams;
  const parsed = rawUserId ? Number(rawUserId) : NaN;
  const userId = isNaN(parsed) ? undefined : parsed;

  const [posts, users] = await Promise.all([getPosts(userId), getUsers()]);

  const postListKey = userId ?? ALL_USERS_VALUE;

  const activeUser = userId ? users.find((u) => u.id === userId) : null;

  const filterLabel = activeUser ? `${activeUser.name}'s Posts` : "All Posts";
  const filterSubtitle = activeUser
    ? `Showing ${posts.length} post${posts.length !== 1 ? "s" : ""} from ${activeUser.name}`
    : `Showing ${posts.length} posts from all authors`;

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
              {posts.length} posts
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
