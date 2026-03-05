import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api/response";
import { API_ERROR_CODES } from "@/lib/api/types";
import { postIdParamSchema } from "@/lib/validations";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id: rawPostId } = await params;
    const postIdValidation = postIdParamSchema.safeParse(rawPostId);

    if (!postIdValidation.success) {
      return apiError(
        API_ERROR_CODES.VALIDATION_ERROR,
        postIdValidation.error.issues[0]?.message ?? "Invalid post id",
        400
      );
    }

    const existingPost = await prisma.post.findFirst({
      where: { id: postIdValidation.data, deletedAt: null },
    });

    if (!existingPost) {
      return apiError(
        API_ERROR_CODES.NOT_FOUND,
        `Post with id ${postIdValidation.data} not found`,
        404
      );
    }

    await prisma.post.update({
      where: { id: postIdValidation.data },
      data: { deletedAt: new Date() },
    });

    return apiSuccess({ id: postIdValidation.data });
  } catch (error) {
    console.error("DELETE /api/v1/posts/[id] error:", error);
    return apiError(
      API_ERROR_CODES.INTERNAL_ERROR,
      "An unexpected error occurred while deleting the post",
      500
    );
  }
}
