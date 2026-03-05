import type { ApiResponse } from "@/types";

const API_BASE = "/api/v1";

export async function deletePost(id: number): Promise<ApiResponse<{ id: number }>> {
  try {
    const response = await fetch(`${API_BASE}/posts/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();
    return data;
  } catch {
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Network error. Please check your connection and try again.",
      },
    };
  }
}
