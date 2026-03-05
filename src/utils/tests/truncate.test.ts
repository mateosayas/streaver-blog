import { describe, expect, it } from "vitest";
import { truncateText } from "../truncate";

describe("truncateText", () => {
  it.each([
    ["short text within limit", "Hello", 10, "Hello"],
    ["custom maxLength exact boundary", "Hello World", 11, "Hello World"],
    ["truncates and appends ellipsis", "Hello World", 5, "Hello…"],
    ["trims trailing whitespace before ellipsis", "Hello     World", 7, "Hello…"],
  ])("%s", (_label, text, maxLength, expected) => {
    expect(truncateText(text, maxLength)).toBe(expected);
  });

  it("returns text unchanged when it equals the default limit exactly", () => {
    const text = "a".repeat(150);
    expect(truncateText(text)).toBe(text);
  });

  it("truncates text that exceeds the default limit and appends ellipsis", () => {
    const text = "a".repeat(200);
    const result = truncateText(text);
    expect(result.endsWith("…")).toBe(true);
    expect(result.length).toBeLessThan(text.length);
  });
});
