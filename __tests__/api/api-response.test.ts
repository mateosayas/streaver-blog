import { describe, it, expect } from "vitest";
import { apiSuccess, apiError } from "@/lib/api/response";
import { API_ERROR_CODES } from "@/lib/api/types";

describe("apiSuccess", () => {
  it("returns success response with data and default 200 status", async () => {
    const response = apiSuccess({ id: 1, name: "Test" });
    const body = await response.json();

    expect(body.success).toBe(true);
    expect(body.data).toEqual({ id: 1, name: "Test" });
    expect(response.status).toBe(200);
  });

  it("includes meta when provided", async () => {
    const response = apiSuccess([1, 2, 3], { total: 3 });
    const body = await response.json();

    expect(body.meta).toEqual({ total: 3 });
  });

  it("omits meta when not provided", async () => {
    const response = apiSuccess("data");
    const body = await response.json();

    expect(body).not.toHaveProperty("meta");
  });

  it("accepts a custom status code", async () => {
    const response = apiSuccess({ id: 1 }, undefined, 201);

    expect(response.status).toBe(201);
  });
});

describe("apiError", () => {
  it.each([
    [API_ERROR_CODES.NOT_FOUND, "Post not found", 404],
    [API_ERROR_CODES.VALIDATION_ERROR, "Invalid input", 400],
    [API_ERROR_CODES.INTERNAL_ERROR, "Something went wrong", 500],
  ] as const)("returns error response for %s", async (code, message, status) => {
    const response = apiError(code, message, status);
    const body = await response.json();

    expect(body.success).toBe(false);
    expect(body.error.code).toBe(code);
    expect(body.error.message).toBe(message);
    expect(response.status).toBe(status);
  });
});
