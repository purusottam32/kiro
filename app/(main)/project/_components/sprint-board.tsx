"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarLoader } from "react-spinners";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";

import { IssueStatus } from "@/lib/generated/prisma/enums";
import type { Prisma } from "@/lib/generated/prisma/client";
import type { IssueWithRelations } from "@/lib/types/prisma";

import useFetch from "@/hooks/use-fetch";
import rawStatuses from "@/data/status.json";
import { getIssuesForSprint, updateIssueOrder } from "@/actions/issues";

import SprintManager from "./sprint-manager";
import IssueCreationDrawer from "./create-issue";
import IssueCard from "@/components/issue-card";
import BoardFilters from "./board-filters";
// import BoardFilters from "./board-filters";

/* ---------------- TYPES ---------------- */

type Sprint = Prisma.SprintGetPayload<{}>;

type SprintBoardProps = {
  sprints: Sprint[];
  projectId: string;
  orgId: string;
};

type StatusColumn = {
  key: IssueStatus;
  name: string;
};

const statuses = rawStatuses as StatusColumn[];

/* ---------------- UTILS ---------------- */

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

/* ---------------- COMPONENT ---------------- */

export default function SprintBoard({
  sprints,
  projectId,
  orgId,
}: SprintBoardProps) {
  /* -------- CURRENT SPRINT (SAFE) -------- */

  const [currentSprint, setCurrentSprint] = useState<Sprint | null>(null);

  useEffect(() => {
    if (!sprints.length) return;
    setCurrentSprint(
      sprints.find((s) => s.status === "ACTIVE") ?? sprints[0]
    );
  }, []);


  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<IssueStatus | null>(null);

  /* -------- FETCH ISSUES -------- */

  const {
    loading: issuesLoading,
    error: issuesError,
    fn: fetchIssues,
    data: issues,
    setData: setIssues,
  } = useFetch(getIssuesForSprint, []);

  const [filters, setFilters] = useState({
    search: "",
    assignees: [] as string[],
    priority: "",
  });
  const filteredIssues = (issues ?? []).filter((issue) => {
      return (
        issue.title
          .toLowerCase()
          .includes(filters.search.toLowerCase()) &&
        (filters.assignees.length === 0 ||
          filters.assignees.includes(issue.assignee?.id ?? "")) &&
        (filters.priority === "" ||
          issue.priority === filters.priority)  
      );
  });


  useEffect(() => {
    if (!currentSprint?.id) return;
    fetchIssues(currentSprint.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSprint?.id]);


  /* -------- CREATE ISSUE -------- */

  const handleAddIssue = (status: IssueStatus) => {
    setSelectedStatus(status);
    setIsDrawerOpen(true);
  };

  const handleIssueCreated = () => {
    if (!currentSprint?.id) return;
    fetchIssues(currentSprint.id);
  };

  /* -------- UPDATE ISSUE ORDER -------- */

  const {
    fn: updateIssueOrderFn,
    loading: updateIssuesLoading,
    error: updateIssuesError,
  } = useFetch(updateIssueOrder, { success: false });

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination || !currentSprint) return;

    if (currentSprint.status === "PLANNED") {
      toast.warning("Start the sprint to update board");
      return;
    }

    if (currentSprint.status === "COMPLETED") {
      toast.warning("Cannot update board after sprint end");
      return;
    }

    const { source, destination } = result;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newOrderedData = [...(issues ?? [])];


    const sourceList = newOrderedData.filter(
      (i) => i.status === source.droppableId
    );
    const destinationList = newOrderedData.filter(
      (i) => i.status === destination.droppableId
    );

    if (source.droppableId === destination.droppableId) {
      const reordered = reorder(
        sourceList,
        source.index,
        destination.index
      );
      reordered.forEach((card, i) => (card.order = i));
    } else {
      const [moved] = sourceList.splice(source.index, 1);
      moved.status = destination.droppableId as IssueStatus;
      destinationList.splice(destination.index, 0, moved);

      sourceList.forEach((card, i) => (card.order = i));
      destinationList.forEach((card, i) => (card.order = i));
    }

    const sorted = newOrderedData.sort(
      (a, b) => a.order - b.order
    );

    setIssues(sorted);
    updateIssueOrderFn(sorted);
  };

  if (!currentSprint) {
    return <div className="p-4">Loading sprint...</div>;
  }

  if (issuesError) {
    return <div>Error loading issues</div>;
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="flex flex-col">
      <SprintManager
        sprint={currentSprint}
        setSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />

      {issues && !issuesLoading && (
        <BoardFilters
          issues={issues}
          filters={filters}
          onChange={setFilters}
        />

      )} 
      {updateIssuesError && (
        <p className="text-red-500 mt-2">
          {updateIssuesError.message}
        </p>
      )}

      {(issuesLoading || updateIssuesLoading) && (
        <BarLoader className="mt-4" width="100%" color="#36d7b7" />
      )}

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
 
                  {filteredIssues
                    .filter((i) => i.status === column.key)
                    .map((issue, index) => (
                      <Draggable
                        key={issue.id}
                        draggableId={issue.id}
                        index={index}
                        isDragDisabled={updateIssuesLoading}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <IssueCard
                              issue={issue}
                              onDelete={() => {
                                if (!currentSprint?.id) return;
                                fetchIssues(currentSprint.id);
                              }}
                              onUpdate={(updated) =>
                                setIssues((prev) => {
                                  if (!prev) return prev;
                                  let changed = false;

                                  const next = prev.map((i) => {
                                    if (i.id === updated.id) {
                                      changed = true;
                                      return updated;
                                    }
                                    return i;
                                  });

                                  return changed ? next : prev;
                                })
                              }
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}

                  {column.key === IssueStatus.TODO &&
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
}
