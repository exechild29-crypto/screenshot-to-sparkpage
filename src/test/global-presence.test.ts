import { describe, expect, it } from "vitest";

import { globalPresence } from "@/content/home";
import { MAP_HEIGHT, MAP_WIDTH, project } from "@/lib/world-map";

const byId = Object.fromEntries(globalPresence.locations.map((location) => [location.id, location]));

describe("Global Presence locations", () => {
  it("lists Dubai, Mangalore and Bangalore as operational", () => {
    for (const id of ["dubai", "mangalore", "bangalore"] as const) {
      expect(byId[id]?.status).toBe("operational");
      expect(byId[id]?.statusLabel).toBe("Operational Location");
    }
  });

  it("lists California, United States as coming soon", () => {
    expect(byId["california"]?.status).toBe("coming-soon");
    expect(byId["california"]?.statusLabel).toBe("Coming Soon");
    expect(byId["california"]?.country).toBe("United States");
  });

  it("places every marker inside the map, California west of Dubai and Dubai west of India", () => {
    const points = Object.fromEntries(
      globalPresence.locations.map((location) => [location.id, project(location.lat, location.lon)]),
    );
    for (const point of Object.values(points)) {
      expect(point.x).toBeGreaterThan(0);
      expect(point.x).toBeLessThan(MAP_WIDTH);
      expect(point.y).toBeGreaterThan(0);
      expect(point.y).toBeLessThan(MAP_HEIGHT);
    }
    const california = points["california"];
    const dubai = points["dubai"];
    const mangalore = points["mangalore"];
    const bangalore = points["bangalore"];
    expect(california).toBeDefined();
    expect(dubai).toBeDefined();
    expect(mangalore).toBeDefined();
    expect(bangalore).toBeDefined();
    if (!california || !dubai || !mangalore || !bangalore) return;
    expect(california.x).toBeLessThan(dubai.x);
    expect(dubai.x).toBeLessThan(mangalore.x);
    expect(mangalore.x).toBeLessThan(bangalore.x);
  });
});