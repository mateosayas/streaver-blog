import "dotenv/config";
import path from "path";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

// Prisma resolves relative SQLite paths from the engine binary's directory, not
// from the schema file. Convert to an absolute path using __dirname (prisma/)
// so resolution matches Prisma's own convention regardless of call site.
const dbUrl = process.env.DATABASE_URL?.startsWith("file:")
  ? `file:${path.resolve(__dirname, process.env.DATABASE_URL.slice(5))}`
  : process.env.DATABASE_URL;

const prisma = new PrismaClient({ datasourceUrl: dbUrl });

const USERS_API = "https://jsonplaceholder.typicode.com/users";
const POSTS_API = "https://jsonplaceholder.typicode.com/posts";

const SALT_ROUNDS = 10;

const DEFAULT_USER_PASSWORD = "password123";
const DEFAULT_ADMIN_PASSWORD = "admin";

const ADMIN_USER = {
  name: "Admin",
  username: "admin",
  email: "admin@streaver-blog.com",
  password: DEFAULT_ADMIN_PASSWORD,
  role: "admin",
  phone: null,
  website: null,
};

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
  console.log("Starting seed...\n");

  console.log("Fetching data from JSONPlaceholder...");
  const [usersResponse, postsResponse] = await Promise.all([fetch(USERS_API), fetch(POSTS_API)]);

  if (!usersResponse.ok) {
    throw new Error(`Failed to fetch users: ${usersResponse.statusText}`);
  }
  if (!postsResponse.ok) {
    throw new Error(`Failed to fetch posts: ${postsResponse.statusText}`);
  }

  const usersData = (await usersResponse.json()) as JSONPlaceholderUser[];
  const postsData = (await postsResponse.json()) as JSONPlaceholderPost[];

  console.log("Hashing passwords...");
  const adminPasswordHash = await bcrypt.hash(ADMIN_USER.password, SALT_ROUNDS);
  const defaultPasswordHash = await bcrypt.hash(DEFAULT_USER_PASSWORD, SALT_ROUNDS);

  console.log("Clearing existing data and seeding...");
  // Transaction ensures all-or-nothing: no partial state if something fails
  await prisma.$transaction(async (tx) => {
    await tx.post.deleteMany();
    await tx.user.deleteMany();

    // Seed JSONPlaceholder users first so their explicit IDs (1–10) are reserved
    // before admin is created with autoincrement (gets ID 11+).
    console.log(`Seeding ${usersData.length} users...`);
    await tx.user.createMany({
      data: usersData.map((user) => ({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        password: defaultPasswordHash,
        role: "user",
        phone: user.phone ?? null,
        website: user.website ?? null,
      })),
    });

    console.log("Seeding admin user...");
    await tx.user.create({
      data: {
        name: ADMIN_USER.name,
        username: ADMIN_USER.username,
        email: ADMIN_USER.email,
        password: adminPasswordHash,
        role: ADMIN_USER.role,
        phone: ADMIN_USER.phone,
        website: ADMIN_USER.website,
      },
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

  console.log("\nSeed completed successfully.");
  console.log(`   → 1 admin user (username: admin, password: admin)`);
  console.log(`   → ${usersData.length} regular users (password: ${DEFAULT_USER_PASSWORD})`);
  console.log(`   → ${postsData.length} posts`);
}

main()
  .catch((e) => {
    console.error("\nSeed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
