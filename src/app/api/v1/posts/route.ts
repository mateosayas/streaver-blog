import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api/response";
import { API_ERROR_CODES } from "@/lib/api/types";
import { userIdFilterSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const rawUserId = searchParams.get("userId");

    const userIdValidation = userIdFilterSchema.safeParse(rawUserId ?? undefined);

    if (!userIdValidation.success) {
      return apiError(
        API_ERROR_CODES.VALIDATION_ERROR,
        userIdValidation.error.issues[0]?.message ?? "Invalid userId parameter",
        400
      );
    }

    const userId = userIdValidation.data;

    const posts = await prisma.post.findMany({
      where: {
        deletedAt: null,
        ...(userId && { userId }),
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return apiSuccess(posts, { total: posts.length });
  } catch (error) {
    console.error("GET /api/v1/posts error:", error);
    return apiError(
      API_ERROR_CODES.INTERNAL_ERROR,
      "An unexpected error occurred while fetching posts",
      500
    );
  }
}