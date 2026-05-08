import type { Metadata } from "next";
import ProjectCard from "@/components/ProjectCard";
import { getAllProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects I've built and contributed to.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
      <p className="mt-2 text-muted">
        Things I&apos;ve built and contributed to.
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
