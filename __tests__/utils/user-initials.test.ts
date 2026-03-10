import { describe, expect, it } from "vitest";
import { getUserInitials } from "@/utils/user-initials";

describe("getUserInitials", () => {
  it.each([
    ["John Doe", "JD"],
    ["John", "J"],
    ["john doe", "JD"],
    ["", ""],
  ])("getUserInitials(%s) → %s", (input, expected) => {
    expect(getUserInitials(input)).toBe(expected);
  });

  it("returns only the first two initials when more than two words are given", () => {
    expect(getUserInitials("John Michael Doe")).toBe("JM");
  });
});
