import { describe, it, expect } from "vitest";
import { userIdFilterSchema, postIdParamSchema } from "@/lib/validations";

const invalidInputs = ["-1", "0", "1.5", "abc", ""];

describe("userIdFilterSchema", () => {
  it.each(["1", "10", "100"])("accepts valid positive integer %s", (input) => {
    const result = userIdFilterSchema.safeParse(input);
    expect(result.success).toBe(true);
    expect(result.data).toBe(Number(input));
  });

  it("accepts undefined", () => {
    const result = userIdFilterSchema.safeParse(undefined);
    expect(result.success).toBe(true);
    expect(result.data).toBeUndefined();
  });

  it.each(invalidInputs)("rejects %s", (input) => {
    expect(userIdFilterSchema.safeParse(input).success).toBe(false);
  });
});

describe("postIdParamSchema", () => {
  it.each(["1", "42", "99"])("accepts valid positive integer %s", (input) => {
    const result = postIdParamSchema.safeParse(input);
    expect(result.success).toBe(true);
    expect(result.data).toBe(Number(input));
  });

  it("rejects undefined", () => {
    expect(postIdParamSchema.safeParse(undefined).success).toBe(false);
  });

  it.each(invalidInputs)("rejects %s", (input) => {
    expect(postIdParamSchema.safeParse(input).success).toBe(false);
  });
});
