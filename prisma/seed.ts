import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const USERS_API = "https://jsonplaceholder.typicode.com/users";
const POSTS_API = "https://jsonplaceholder.typicode.com/posts";

type JSONPlaceholderUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
};

type JSONPlaceholderPost = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

async function main() {
  console.log("\n🌱 Starting seed...\n");

  console.log("Fetching data from JSONPlaceholder...");
  const [usersResponse, postsResponse] = await Promise.all([
    fetch(USERS_API),
    fetch(POSTS_API),
  ]);

  if (!usersResponse.ok) {
    throw new Error(`Failed to fetch users: ${usersResponse.statusText}`);
  }
  if (!postsResponse.ok) {
    throw new Error(`Failed to fetch posts: ${postsResponse.statusText}`);
  }

  const usersData = (await usersResponse.json()) as JSONPlaceholderUser[];
  const postsData = (await postsResponse.json()) as JSONPlaceholderPost[];

  // Preserves idempotency — safe to run multiple times
  console.log("Clearing existing data and seeding...");
  // Transaction ensures all-or-nothing: no partial state if something fails
  await prisma.$transaction(async (tx) => {
    await tx.post.deleteMany();
    await tx.user.deleteMany();

    console.log(`Seeding ${usersData.length} users...`);
    await tx.user.createMany({
      data: usersData.map((user) => ({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone ?? null,
        website: user.website ?? null,
      })),
    });

    console.log(`Seeding ${postsData.length} posts...`);
    await tx.post.createMany({
      data: postsData.map((post) => ({
        id: post.id,
        title: post.title,
        body: post.body,
        userId: post.userId,
      })),
    });
  });

  console.log("\n✅ Seed completed successfully!");
  console.log(`   → ${usersData.length} users`);
  console.log(`   → ${postsData.length} posts`);
}

main()
  .catch((e) => {
    console.error("\n❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });