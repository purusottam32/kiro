"use client";

import React, { useEffect, useState } from "react";
import SprintManager from "./sprint-manager";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import statuses from "@/data/status.json";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import IssueCreationDrawer from "./create-issue";
import useFetch from "@/hooks/use-fetch";
import { getIssuesForSprint } from "@/actions/issues";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";
import type { Prisma } from "@/lib/generated/prisma/client";

/* ---------------- TYPES ---------------- */

type IssueWithRelations = Prisma.IssueGetPayload<{
  include: {
    assignee: true;
    reporter: true;
  };
}>;

/* ---------------- UTILS ---------------- */

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

/* ---------------- COMPONENT ---------------- */

const SprintBoard = ({
  sprints = [],
  projectId,
  orgId,
}: {
  sprints?: any[];
  projectId: string;
  orgId: string;
}) => {
  const [currentSprint, setCurrentSprint] = useState(
    sprints.find((spr) => spr.status === "ACTIVE") ?? sprints[0] ?? null
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const {
    loading: issueLoading,
    error: issuesError,
    fn: fetchIssues,
    data: issues = [],
    setData: setIssues,
  } = useFetch<IssueWithRelations[]>(getIssuesForSprint,[]);

  useEffect(() => {
    if (!currentSprint?.id) return;
    fetchIssues(currentSprint.id);
  }, [currentSprint?.id]);


  const handleAddIssue = (status: string) => {
    setSelectedStatus(status);
    setIsDrawerOpen(true);
  };

  const handleIssueCreated = () => {
    if (currentSprint?.id) {
      fetchIssues(currentSprint.id);
    }
  };

  const onDragEnd = async (result: any) => {
    if (!currentSprint) return;

    if (currentSprint.status === "PLANNED") {
      toast.warning("Start the sprint to update board");
      return;
    }

    if (currentSprint.status === "COMPLETED") {
      toast.warning("Cannot update board after sprint end");
      return;
    }

    const { destination, source } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newOrderData = [...issues];

    const sourceList = newOrderData.filter(
      (i) => i.status === source.droppableId
    );

    const destinationList = newOrderData.filter(
      (i) => i.status === destination.droppableId
    );

    if (source.droppableId === destination.droppableId) {
      const reordered = reorder(
        sourceList,
        source.index,
        destination.index
      );

      reordered.forEach((card, i) => {
        card.order = i;
      });
    } else {
      const [moved] = sourceList.splice(source.index, 1);
      moved.status = destination.droppableId;
      destinationList.splice(destination.index, 0, moved);

      destinationList.forEach((card, i) => {
        card.order = i;
      });
    }

    const sortedIssues = newOrderData.sort((a, b) => a.order - b.order);
    setIssues(sortedIssues);
  };

  if (!currentSprint) return <div>No sprints available</div>;
  if (issuesError) return <div>Error loading issues</div>;

  return (
    <div>
      <SprintManager
        sprint={currentSprint}
        setSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />

      {issueLoading && <BarLoader className="mt-4" width="100%" />}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 bg-slate-900 p-4 rounded-lg">
          {statuses.map((column) => (
            <Droppable key={column.key} droppableId={column.key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-2"
                >
                  <h3 className="font-semibold mb-2 text-center">
                    {column.name}
                  </h3>

                  {issues
                    .filter((i) => i.status === column.key)
                    .map((issue) => (
                      <div key={issue.id}>{issue.title}</div>
                    ))}

                  {provided.placeholder}

                  {column.key === "TODO" &&
                    currentSprint.status !== "COMPLETED" && (
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => handleAddIssue(column.key)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Issue
                      </Button>
                    )}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <IssueCreationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
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
