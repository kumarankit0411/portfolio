import type { Metadata } from "next";
import ProjectCard from "@/components/ProjectCard";
import { getAllShowcaseProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Biker Bazaar and the systems I've built along the way.",
};

export default function ProjectsPage() {
  const projects = getAllShowcaseProjects();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
      <p className="mt-2 text-muted">
        Things I&apos;ve founded, built, and contributed to.
      </p>
      {projects.length > 0 ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-sm text-muted">
          No projects yet. Check back soon.
        </p>
      )}
    </div>
  );
}
