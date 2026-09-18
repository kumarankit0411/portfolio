import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import ProjectCard from "@/components/ProjectCard";
import ArticleCard from "@/components/ArticleCard";
import { getAllProjects, getAllArticles } from "@/lib/content";

export default function Home() {
  const projects = getAllProjects().slice(0, 3);
  const articles = getAllArticles().slice(0, 4);

  return (
    <div className="space-y-24">
      {/* Hero */}
      <section className="space-y-6">
        <p className="font-mono text-sm text-accent">Hi, my name is</p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Ankit Kumar.
        </h1>
        <h2 className="text-2xl font-semibold tracking-tight text-muted sm:text-3xl">
          Founder & CEO of Biker Bazaar.
        </h2>
        <p className="max-w-lg text-base leading-relaxed text-muted">
          I spent 7 years building high-performance web architecture for
          Fortune 500 marketing brands at{" "}
          <a
            href="https://bluecore.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-light transition-colors"
          >
            Bluecore
          </a>
          . Now I&apos;m building{" "}
          <a
            href="https://bikerbazaar.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-light transition-colors"
          >
            bikerbazaar.in
          </a>
          , a marketplace for buying and selling used motorcycles and riding
          gear across India.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/projects"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-accent bg-accent/10 px-5 text-sm font-medium text-accent-light transition-all hover:bg-accent/20"
          >
            View Projects
          </Link>
          <a
            href="/Ankit_Kumar_Singh_Resume.pdf"
            target="_blank"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border px-5 text-sm font-medium text-foreground transition-all hover:border-muted"
          >
            Resume
          </a>
        </div>
      </section>

      {/* Spotlight */}
      <section className="animate-fade-in rounded-xl border border-accent/30 bg-gradient-to-br from-accent/10 via-transparent to-transparent p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-sm text-accent">Currently building</p>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent-light">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Live
          </span>
        </div>
        <h3 className="mt-3 text-2xl font-bold tracking-tight">
          Biker Bazaar
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          An online marketplace for used motorcycles, helmets, boots, and
          riding gear in India. I founded it and built the entire product — from
          the marketplace core and search to Razorpay payments, premium tiers,
          and an SEO content engine.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Founder & CEO", "Products", "Marketplaces", "SEO"].map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent-light"
            >
              {tag}
            </span>
          ))}
        </div>
        <a
          href="https://bikerbazaar.in"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex h-10 items-center justify-center rounded-lg border border-accent bg-accent/10 px-5 text-sm font-medium text-accent-light transition-all hover:bg-accent/20"
        >
          Visit bikerbazaar.in &rarr;
        </a>
      </section>

      {/* About */}
      <section>
        <SectionHeading number="01." title="About Me" />
        <div className="space-y-4 text-base leading-relaxed text-muted">
          <p>
            I&apos;m the founder and CEO of Biker Bazaar, a live marketplace
            for used motorcycles and riding gear in India. Before that I spent
            7 years at Bluecore as a Senior Software Engineer, building and
            maintaining enterprise-grade marketing platforms for Fortune 500
            brands — from architecting Vanilla JS engines for Tier-1 retailers
            like Nike and Reebok to building AI-powered tools that convert
            natural language into runnable audience segments.
          </p>
          <p>
            My expertise lies in JavaScript internals, React, TypeScript, and
            Next.js, with deep experience in building high-performance frontend
            systems. Today I apply that same engineering to my own product —
            designing marketplace features, payment flows, and growth systems
            end-to-end, from SQL schema to shipped UI.
          </p>
        </div>
      </section>

      {/* Experience */}
      <section>
        <SectionHeading number="02." title="Experience" />
        <div className="space-y-6">
          {[
            {
              role: "Founder & CEO",
              company: "Biker Bazaar",
              period: "Jun 2026 — Present",
              description:
                "Founded and built bikerbazaar.in, an online marketplace for used motorcycles, helmets, boots, and riding gear in India. Sole engineer from idea to launch — marketplace core, search and filters, Razorpay monetization with premium tiers, and an SEO content engine driving organic growth.",
              tags: [
                "Next.js",
                "TypeScript",
                "Supabase",
                "Razorpay",
                "SEO",
                "Product",
              ],
            },
            {
              role: "Senior Software Engineer 2.2",
              company: "Bluecore",
              period: "Feb 2026 — May 2026",
              description:
                "Leveraging AI (Claude Code) to automate data extraction across 450+ repositories for Python 2 to 3 migration. Architecting new user-facing features and optimizing legacy modules for improved performance and engagement.",
              tags: ["React", "TypeScript", "Python", "Claude Code", "AI"],
            },
            {
              role: "Senior Software Engineer 2.1",
              company: "Bluecore",
              period: "Feb 2023 — Jan 2026",
              description:
                "Enhanced the Audience Builder with sophisticated marketing journey tools. Engineered an AI Agent to convert natural language into runnable audience segments. Built a self-improving RAG database and an agent engine service with auth.",
              tags: [
                "React",
                "TypeScript",
                "Python",
                "AI",
                "RAG",
                "Next.js",
              ],
            },
            {
              role: "Software Engineer 1.2",
              company: "Bluecore",
              period: "Feb 2021 — Jan 2023",
              description:
                "Scaled a Vanilla JS engine supporting complex campaign types including dynamic product recommendations and social proofing. Replaced jQuery with a custom library, achieving 5x bundle size reduction (30KB to 6KB).",
              tags: [
                "JavaScript",
                "Vanilla JS",
                "jQuery Migration",
                "Performance",
              ],
            },
            {
              role: "Software Engineer 1.1",
              company: "Bluecore",
              period: "Dec 2018 — Jan 2021",
              description:
                "Developed a high-performance Vanilla JS engine for Tier-1 retailers (Nike, Reebok). Drove large-scale campaign execution and analytics across North America. Awarded the VIC Award for scaling campaign architecture with zero-latency execution.",
              tags: ["JavaScript", "Vanilla JS", "Nike", "Reebok"],
            },
            {
              role: "Robotics & AI Research Intern",
              company: "JMoon Technologies",
              period: "Aug 2018 — Nov 2018",
              description:
                "Engineered a CNN-based facial recognition system for an autonomous home robot, optimized for real-time inference on ODROID-XU4 SBCs. Developed a few-shot learning pipeline requiring only 4-5 training images.",
              tags: ["Python", "Computer Vision", "CNN", "AI"],
            },
          ].map((exp, i) => (
            <div
              key={i}
              className="group relative rounded-lg border border-border bg-surface p-5 transition-all hover:border-accent/40"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {exp.role}{" "}
                    <span className="text-accent">· {exp.company}</span>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {exp.description}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-xs text-muted whitespace-nowrap">
                  {exp.period}
                </span>
              </div>
              {exp.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent-light"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <SectionHeading number="03." title="Skills" />
        <div className="flex flex-wrap gap-2">
          {[
            "React",
            "TypeScript",
            "Next.js",
            "JavaScript",
            "Python",
            "SQL",
            "Google Cloud Platform",
            "CI/CD",
            "Cursor",
            "MCP",
            "Claude Code",
          ].map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center rounded-full bg-accent/10 px-3.5 py-1.5 text-sm font-medium text-accent-light"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section>
        <SectionHeading number="04." title="Projects" />
        {projects.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">
            Projects coming soon. Check back later.
          </p>
        )}
        <Link
          href="/projects"
          className="mt-6 inline-flex text-sm text-accent hover:text-accent-light transition-colors"
        >
          View all projects &rarr;
        </Link>
      </section>

      {/* Articles */}
      <section>
        <SectionHeading number="05." title="Articles" />
        {articles.length > 0 ? (
          <div>
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">
            Articles coming soon. Check back later.
          </p>
        )}
        <Link
          href="/articles"
          className="mt-6 inline-flex text-sm text-accent hover:text-accent-light transition-colors"
        >
          View all articles &rarr;
        </Link>
      </section>

      {/* Education */}
      <section>
        <SectionHeading number="06." title="Education" />
        <div className="rounded-lg border border-border bg-surface p-5">
          <h3 className="font-semibold text-foreground">
            B.Tech in Computer Science
          </h3>
          <p className="mt-1 text-sm text-muted">
            Hindustan College of Science & Technology, Mathura
          </p>
          <p className="mt-1 font-mono text-xs text-muted">
            2014 — 2018 · 78.78%
          </p>
        </div>
      </section>

      {/* Achievements */}
      <section>
        <SectionHeading number="07." title="Achievements" />
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-surface p-5">
            <h3 className="font-semibold text-foreground">
              VIC Award · Bluecore
            </h3>
            <p className="mt-1 text-sm text-muted">
              Peer-nominated award for excellence implementing high-value
              features in JS integration for major brands like Nike,
              significantly increasing their revenue.
            </p>
            <span className="mt-2 inline-flex font-mono text-xs text-muted">
              2020
            </span>
          </div>
          <div className="rounded-lg border border-border bg-surface p-5">
            <h3 className="font-semibold text-foreground">
              2nd Runner Up · E-Yantra Robotics Competition
            </h3>
            <p className="mt-1 text-sm text-muted">
              IIT Bombay. Built a robot from scratch and performed tasks in a
              pre-defined environment and timeline. Presented at IIT Bombay
              after reaching the finale.
            </p>
            <span className="mt-2 inline-flex font-mono text-xs text-muted">
              2016
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
