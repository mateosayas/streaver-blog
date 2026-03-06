import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api/response";
import { API_ERROR_CODES } from "@/lib/api/types";
import { postIdParamSchema } from "@/lib/validations";
import { softDeletePost } from "@/lib/data/posts";

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

    const result = await softDeletePost(postIdValidation.data);

    if (!result) {
      return apiError(
        API_ERROR_CODES.NOT_FOUND,
        `Post with id ${postIdValidation.data} not found`,
        404
      );
    }

    return apiSuccess(result);
  } catch (error) {
    console.error("DELETE /api/v1/posts/[id] error:", error);
    return apiError(
      API_ERROR_CODES.INTERNAL_ERROR,
      "An unexpected error occurred while deleting the post",
      500
    );
  }
}
