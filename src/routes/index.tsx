import { useCallback, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { About } from "@/sections/About";
import { GlobalPresence } from "@/sections/GlobalPresence";
import { Hero } from "@/sections/Hero";
import { IntroAnimation } from "@/sections/IntroAnimation";
import { WhyManager } from "@/sections/WhyManager";

const title = "DevOps Manager LLP — Modern Business Management Suite";
const description =
  "Business software, workflow automation, CRM, ERP and AI-powered systems that help organisations manage today and build a better tomorrow.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      {
        property: "og:description",
        content: "Software automation and intelligent management solutions for education, startups and retail.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [ready, setReady] = useState(false);
  const onEnter = useCallback(() => setReady(true), []);

  return (
    <>
      <IntroAnimation onEnter={onEnter} />
      <Header />
      <main>
        <Hero ready={ready} />
        <About />
        <GlobalPresence />
        <WhyManager />
      </main>
      <Footer />
    </>
  );
}
