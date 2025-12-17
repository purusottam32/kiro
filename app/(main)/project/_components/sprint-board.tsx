"use client";
import React from "react";
import SprintManager from "./sprint-manager";

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

  if (!currentSprint) {
    return <div>No sprints available</div>;
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
    </div>
  );
};

export default SprintBoard;
