import { describe, expect, it } from "vitest";
import { pluralize } from "@/utils/pluralize";

describe("pluralize", () => {
  it.each([
    [0, "post", "s", "0 posts"],
    [1, "post", "s", "1 post"],
    [2, "post", "s", "2 posts"],
    [100, "post", "s", "100 posts"],
  ])("pluralize(%i, %s) → %s", (count, noun, suffix, expected) => {
    expect(pluralize(count, noun, suffix)).toBe(expected);
  });

  it("uses default suffix 's' when not provided", () => {
    expect(pluralize(2, "user")).toBe("2 users");
  });

  it("supports custom suffix", () => {
    expect(pluralize(1, "match", "es")).toBe("1 match");
    expect(pluralize(2, "match", "es")).toBe("2 matches");
  });
});
