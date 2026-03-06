import { describe, expect, it } from "vitest";
import { getInitials } from "@/utils/initials";

describe("getInitials", () => {
  it.each([
    ["John Doe", "JD"],
    ["John", "J"],
    ["john doe", "JD"],
    ["", ""],
  ])("getInitials(%s) → %s", (input, expected) => {
    expect(getInitials(input)).toBe(expected);
  });

  it("returns only the first two initials when more than two words are given", () => {
    expect(getInitials("John Michael Doe")).toBe("JM");
  });
});
