import { describe, expect, it } from "vitest";

import { whatWeDo, whomWeServe } from "@/content/home";
import { exploreHref } from "@/lib/explore-link";

describe("Explore Solutions links", () => {
  it("send visitors to the contact area while a detail page is not built", () => {
    expect(exploreHref({ route: "/industries/education", live: false })).toBe("#contact");
  });

  it("use the detail page once it goes live", () => {
    expect(exploreHref({ route: "/solutions/crm-erp", live: true })).toBe("/solutions/crm-erp");
  });

  it("keep the planned industry and solution routes ready", () => {
    expect(whomWeServe.industries.map((i) => i.link.route)).toEqual([
      "/industries/education",
      "/industries/startups",
      "/industries/ecommerce-retail",
    ]);
    expect(whatWeDo.capabilities.map((c) => c.link.route)).toEqual([
      "/solutions/business-software",
      "/solutions/workflow-automation",
      "/solutions/crm-erp",
      "/solutions/ai-systems",
    ]);
  });
});
