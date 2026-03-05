import { NextResponse } from "next/server";
import type { ApiSuccessResponse, ApiErrorResponse, ApiErrorCode } from "@/lib/api/types";

export function apiSuccess<T>(
  data: T,
  meta?: ApiSuccessResponse<T>["meta"],
  status: number = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({ success: true, data, ...(meta && { meta }) }, { status });
}

export function apiError(
  code: ApiErrorCode,
  message: string,
  status: number
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    { success: false, error: { code, message } },
    { status }
  );
}
