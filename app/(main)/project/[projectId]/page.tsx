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
    <div className="container mx-auto">
      {/* sprint creation */}
      <SprintCreationForm
        projectId={projectId}
        projectTitle={project.name}
        projectKey={project.key}
        sprints={(project.sprints?.length ?? 0) + 1}
      />

      {/* sprint board */}
      <SprintBoard
        sprints={project.sprints ?? []}
        projectId={projectId}
        orgId={project.organizationId}
      />
    </div>
  );
};

export default ProjectPage;
