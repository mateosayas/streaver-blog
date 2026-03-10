import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/api/response";
import { API_ERROR_CODES } from "@/lib/api/types";
import { postIdParamSchema } from "@/lib/validations/posts";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user) {
      return apiError(API_ERROR_CODES.UNAUTHORIZED, "You must be logged in to delete posts", 401);
    }

    // Validating post id
    const { id: rawId } = await params;
    const result = postIdParamSchema.safeParse(rawId);

    if (!result.success) {
      return apiError(
        API_ERROR_CODES.VALIDATION_ERROR,
        result.error.issues[0]?.message ?? "Invalid post id",
        400
      );
    }

    const postId = result.data;

    const existingPost = await prisma.post.findFirst({
      where: { id: postId, deletedAt: null },
    });

    if (!existingPost) {
      return apiError(API_ERROR_CODES.NOT_FOUND, "Post not found", 404);
    }

    const isAdmin = session.user.role === "admin";
    const isOwner = existingPost.userId === Number(session.user.id);

    if (!isAdmin && !isOwner) {
      return apiError(
        API_ERROR_CODES.FORBIDDEN,
        "You do not have permission to delete this post",
        403
      );
    }

    await prisma.post.update({
      where: { id: postId },
      data: { deletedAt: new Date() },
    });

    return apiSuccess({ id: postId });
  } catch {
    return apiError(
      API_ERROR_CODES.INTERNAL_ERROR,
      "An unexpected error occurred while deleting the post",
      500
    );
  }
}
