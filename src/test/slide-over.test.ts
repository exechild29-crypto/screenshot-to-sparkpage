import { describe, expect, it } from "vitest";

import { edgeStrength, slideProgress } from "@/lib/slide-over";

describe("Hero → About slide-over", () => {
  it("About has not entered while its top is at or below the viewport bottom", () => {
    expect(slideProgress(800, 800)).toBe(0);
    expect(slideProgress(1200, 800)).toBe(0);
  });

  it("About fully covers once its top reaches the viewport top", () => {
    expect(slideProgress(0, 800)).toBe(1);
    expect(slideProgress(-500, 800)).toBe(1);
  });

  it("progress follows the scroll proportionally", () => {
    expect(slideProgress(400, 800)).toBe(0.5);
  });

  it("the edge shadow is gone before and after the transition", () => {
    expect(edgeStrength(0)).toBe(0);
    expect(edgeStrength(1)).toBe(0);
    expect(edgeStrength(0.3)).toBeGreaterThan(0);
  });
});
