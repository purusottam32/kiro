"use client";
import React from "react";
import SprintManager from "./sprint-manager";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import statuses from "@/data/status.json";
import { stat } from "fs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import IssueCreationDrawer from "./create-issue";

const SprintBoard = ({
  sprints = [],
  projectId,
  orgId,
}: {
  sprints?: any[];
  projectId: string;
  orgId: string;
}) => {
  const [currentSprint, setCurrentSprint] = React.useState(
    sprints.find((spr) => spr.status === "ACTIVE") ?? sprints[0] ?? null
  );
  const [isDrawarOpen, setIsDrawarOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<any>(null);

  if (!currentSprint) {
    return <div>No sprints available</div>;
  }
  const handleAddIssue = (status: string) => {
    setSelectedStatus(status);
    setIsDrawarOpen(true);
    console.log(`Add issue to status: ${status} in sprint: ${currentSprint.id}`);
  }
  const handleIssueCreated = () => {
    
  }
  const onDragEnd = (result: any) => {

  }

  return (
    <div>
      <SprintManager
        sprint={currentSprint}
        setSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />
      {/* kanban board here */}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 bg-slate-900 p-4 rounded-lg">
            {statuses.map((column) => (
            <Droppable key={column.key} droppableId={column.key}>
              {(provided)=>{
               return (
                <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                  <h3 className="font-semibold mb-2 text-center">{column.name}</h3>

                  {/* Issues */}
                  {provided.placeholder}
                  {column.key == "TODO" && currentSprint.status != "completed" && (
                    <Button 
                      variant="ghost" 
                      className="w-full"
                      onClick={()=>handleAddIssue(column.key)}>
                        <Plus className="mr-2 h-4 w-4"/>
                        Create Issue
                    </Button>
                  )}
                </div>
              )}}
            </Droppable>
            ))}
        </div>
      </DragDropContext>
      <IssueCreationDrawer
      isOpen={isDrawarOpen}
      onClose={()=>setIsDrawarOpen(false)}
      sprintId={currentSprint.id}
      status={selectedStatus!}
      projectId={projectId}
      onIssueCreated={handleIssueCreated}
      orgId={orgId}
      />
    </div>
  );
};

export default SprintBoard;
