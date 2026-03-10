import { describe, expect, it } from "vitest";
import { iife } from "@/utils/iife";

describe("iife", () => {
  it("returns the value from the callback", () => {
    expect(iife(() => 42)).toBe(42);
    expect(iife(() => "hello")).toBe("hello");
    expect(iife(() => true)).toBe(true);
  });

  it("returns the correct value from conditional logic", () => {
    const active = true;
    expect(
      iife(() => {
        if (!active) return "none";

        return "active";
      })
    ).toBe("active");
  });

  it("works with object return types", () => {
    const result = iife(() => ({ x: 1, y: 2 }));

    expect(result).toEqual({ x: 1, y: 2 });
  });
});
