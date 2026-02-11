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
// import type { IssueWithRelations } from "@/lib/types/prisma";

import useFetch from "@/hooks/use-fetch";
import rawStatuses from "@/data/status.json";
import { getIssuesForSprint, updateIssueOrder } from "@/actions/issues";

import SprintManager from "./sprint-manager";
import IssueCreationDrawer from "./create-issue";
import IssueCard from "@/components/issue-card";
import BoardFilters from "./board-filters";

/* ---------------- TYPES ---------------- */

type Sprint = Prisma.SprintGetPayload<Record<string, never>>;

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
  /* -------- CURRENT SPRINT -------- */

  const [currentSprint, setCurrentSprint] = useState<Sprint | null>(null);

  useEffect(() => {
    if (!sprints.length) {
      setCurrentSprint(null);
      return;
    }

    setCurrentSprint(
      sprints.find((s) => s.status === "ACTIVE") ?? sprints[0]
    );
  }, [sprints]);

  /* -------- DRAWER -------- */

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

  useEffect(() => {
    if (!currentSprint?.id) return;
    fetchIssues(currentSprint.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSprint?.id]);

  /* -------- FILTERS -------- */

  const [filters, setFilters] = useState({
    search: "",
    assignees: [] as string[],
    priority: "",
  });

  const filteredIssues = (issues ?? []).filter((issue) => {
    return (
      issue.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.assignees.length === 0 ||
        filters.assignees.includes(issue.assignee?.id ?? "")) &&
      (filters.priority === "" ||
        issue.priority === filters.priority)
    );
  });

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

    const sorted = newOrderedData.sort((a, b) => a.order - b.order);

    setIssues(sorted);
    updateIssueOrderFn(sorted);
  };

  /* ---------------- EMPTY & ERROR STATES ---------------- */

  // 🚫 NO SPRINTS
  if (sprints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-2">No sprints yet</h2>
        <p className="text-gray-400 mb-6 max-w-md">
          This project doesn’t have any sprints.
          Create your first sprint to start planning work.
        </p>
        {/* <Button onClick={() => toast.info("Create a sprint from the top-right button")}>
          Create Sprint
        </Button> */}
      </div>
    );
  }

  // ⏳ LOADING CURRENT SPRINT
  if (!currentSprint) {
    return (
      <div className="flex items-center gap-3 p-4 text-gray-400">
        <BarLoader width={120} color="#0A5BFF" />
        <span>Loading sprint…</span>
      </div>
    );
  }

  if (issuesError) {
    return <div className="p-4 text-red-500">Error loading issues</div>;
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
        <BarLoader className="mt-4" width="100%" color="#0A5BFF" />
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-6 rounded-2xl border border-white/5">
          {statuses.map((column) => (
            <Droppable key={column.key} droppableId={column.key}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-2 min-h-[600px] p-4 rounded-xl transition-all duration-200 ${
                    snapshot.isDraggingOver
                      ? 'bg-blue-500/10 border border-blue-500/30'
                      : 'bg-white/5 border border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-linear-to-r from-blue-500 to-cyan-500"></span>
                      {column.name}
                    </h3>
                    <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-gray-400">
                      {filteredIssues.filter((i) => i.status === column.key).length}
                    </span>
                  </div>

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
                              onDelete={() =>
                                fetchIssues(currentSprint.id)
                              }
                              onUpdate={(updated) =>
                                setIssues((prev) => {
                                  if (!prev) return prev;
                                  return prev.map((i) =>
                                    i.id === updated.id ? updated : i
                                  );
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
                        className="w-full mt-4 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 border border-dashed border-blue-500/30 hover:border-blue-500/50 transition-all duration-200"
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
