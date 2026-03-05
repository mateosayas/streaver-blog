import { prisma } from "@/lib/prisma";

export async function getPosts(userId?: number) {
  return prisma.post.findMany({
    where: {
      deletedAt: null,
      ...(userId && { userId }),
    },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUsers() {
  return prisma.user.findMany({
    orderBy: { name: "asc" },
  });
}
