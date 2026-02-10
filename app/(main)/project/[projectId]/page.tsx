import { getProject } from "@/actions/projects";
import { notFound } from "next/navigation";
import React from "react";
import SprintCreationForm from "../_components/create-sprint";
import SprintBoard from "../_components/sprint-board";

interface Props {
  params: Promise<{
    orgId?: string;
    projectId: string;
  }>;
}

const ProjectPage = async ({ params }: Props) => {
  // ✅ MUST await params in Next.js 15
  const { projectId } = await params;

  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="gradient-title text-4xl md:text-5xl mb-2">{project.name}</h1>
          <p className="text-slate-400 text-sm">
            Project Key: <span className="font-mono font-semibold text-blue-400">{project.key}</span>
          </p>
        </div>

        {/* Sprint creation */}
        <SprintCreationForm
          projectId={projectId}
          projectTitle={project.name}
          projectKey={project.key}
          sprints={(project.sprints?.length ?? 0) + 1}
        />

        {/* sprint board */}
        <div className="mt-8">
          <SprintBoard
            sprints={project.sprints ?? []}
            projectId={projectId}
            orgId={project.organizationId}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
