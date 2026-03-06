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

export async function softDeletePost(id: number): Promise<{ id: number } | null> {
  const post = await prisma.post.findFirst({
    where: { id, deletedAt: null },
  });

  if (!post) return null;

  await prisma.post.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return { id };
}
