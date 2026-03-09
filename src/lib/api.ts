import type { ApiResponse } from "@/types";

const API_BASE = "/api/v1";

function internalError(message: string): ApiResponse<never> {
  return {
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message,
    },
  };
}

export async function deletePost(id: number): Promise<ApiResponse<{ id: number }>> {
  try {
    const response = await fetch(`${API_BASE}/posts/${id}`, {
      method: "DELETE",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return data ?? internalError("An unexpected error occurred. Please try again.");
    }

    return data;
  } catch {
    return internalError("Network error. Please check your connection and try again.");
  }
}
