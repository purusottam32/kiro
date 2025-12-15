import { getProject } from '@/actions/projects';
import { notFound } from 'next/navigation';
import React from 'react'

interface Props {
  params: { orgId?: string,projectId: string };
}

const ProjectPage =async ({params}: Props) => {
  const { projectId } = params;
  const project = await getProject(projectId);

  if(!project) {
    notFound();
  }
  return (
    <div className='container mx-auto'>
      {/* sprint creation */}
      <SprintCreationForm
        projectId={projectId}
        projectTitle={project.name}
        projectKey={project.key}  
        sprints={project.sprints?.length+1}
      />  


    </div>
  )
}

export default ProjectPage