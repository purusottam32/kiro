import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import  {createSprint}  from '@/actions/sprints';

const SprintCreationForm = ({projectId, projectTitle, projectKey, sprints}: {projectId: string, projectTitle: string, projectKey: string, sprints: number   }) => {
    const [showForm, setShowForm] = useState(false);
    const form = useForm({
        resolver: zodResolver(createSprint),
        defaultValues: {
            name: `${projectKey}-${sprints}`,
        }
    });
    return (
    <>
        <div>
            <h1>{projectTitle}</h1>
            <Button 
                className='mt-2' 
                onClick={()=>setShowForm(!showForm)}
                variant={showForm ? "destructive":"default"}
            >
                {showForm ? "Cancel" : "Create New Sprint"}
            </Button>
        </div>

        {showForm && (
            <>form</>
        )}
    </>
  )
}

export default SprintCreationForm