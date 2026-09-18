# Ankit Kumar Singh

**Founder & CEO, Biker Bazaar · ex-Senior Software Engineer at Bluecore**

Web: imankit.dev · Email: ankitsingh095@outlook.com
LinkedIn: linkedin.com/in/kumarankit0411 · GitHub: github.com/kumarankit0411

## Summary

I founded Biker Bazaar (bikerbazaar.in), a marketplace for buying and selling used motorcycles and riding gear in India, and built it myself — the site, the database, the payments, the content. It's live and running.

Before that I spent seven years at Bluecore on one product, at three depths: the JavaScript runtime that runs on retailer websites, the React app where brands build campaigns and audiences, and the AI agent that generates segments from a sentence. I built the runtime from zero — including data handling and personalization stored in IndexedDB — and later led the AI work.

## Experience

### Founder & CEO — Biker Bazaar | Jun 2026 – Present

- Biker Bazaar is a marketplace for used motorcycles, helmets, boots, and riding gear in India. I'm the only engineer; I built the whole product and run it full-time.
- Listings with category/brand/size filters, a structured listing flow, and Supabase for auth, Postgres, and storage.
- Monetization: Razorpay payments with three premium tiers (Basic, Pro, Max), featured slots, and phone unlock for buyers.
- An SEO blog with eight India-specific buying guides plus sitemap/robots setup — it's the main acquisition channel.
- Stack: Next.js, TypeScript, Supabase, Razorpay, Vercel.

### Senior Software Engineer — Bluecore | Dec 2018 – May 2026

Seven years, one product, three layers.

**Runtime layer (2018–2021)**
- I was asked to build the JavaScript layer that retailers embed on their sites — it serves email-capture, exit-intent, and recommendation campaigns.
- Wrote the whole thing in vanilla JS, from data handling to saving personalization state in IndexedDB. No framework, no dependencies.
- Kept execution inside `requestAnimationFrame` so campaigns never cause layout jank, even during Nike and Reebok Black Friday traffic.
- Received Bluecore's VIC Award for this work.

**Builder layer (2021–2023)**
- Built the React web app where brands create and manage site campaigns and audiences.
- Replaced jQuery with a 6KB custom library — 30KB to 6KB, 5x smaller, 3x faster DOM operations, no lost functionality.
- Extended the runtime to more complex campaign types: product recommendations and social proof.

**AI layer (2023–2026)**
- Built the Audience Agent: a user describes an audience in plain English and the agent returns a ready, runnable segment.
- It handles over 40% of audience creation at Bluecore.
- Built a self-improving RAG database (accuracy rose ~15%/month early on) and a standalone agent service with its own auth.

### Robotics & AI Research Intern — JMoon Technologies | Aug 2018 – Nov 2018

- CNN-based facial recognition for a home robot, few-shot — 4–5 training images per face, real-time on an ODROID-XU4.

## Selected Projects

- **Biker Bazaar** — live marketplace, solo-built (bikerbazaar.in).
- **Audience Builder AI Agent** — natural language to runnable segments (Bluecore).
- **Vanilla JS engine** — 6KB, zero dependencies, runs campaigns for Nike and Reebok.
- **jQuery migration** — 5x smaller bundle, same API, no regressions.

## Skills

- Languages: JavaScript, TypeScript, Python, SQL
- Web: React, Next.js, vanilla JS, browser and performance work
- AI: LLM agents, RAG, prompt-driven development (Claude Code, MCP, Cursor)
- Infra: Supabase/Postgres, Razorpay, Vercel, GCP, CI/CD, Tailscale

## Education

B.Tech in Computer Science — Hindustan College of Science & Technology, Mathura (2014–2018), 78.78%

## Achievements

- VIC Award, Bluecore, 2020.
- 2nd Runner Up, E-Yantra Robotics Competition, IIT Bombay, 2016.