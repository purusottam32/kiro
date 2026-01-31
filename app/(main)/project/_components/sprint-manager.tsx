"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarLoader } from "react-spinners";
import {
  formatDistanceToNow,
  isAfter,
  isBefore,
  format,
} from "date-fns";
import useFetch from "@/hooks/use-fetch";
import { useRouter } from "next/navigation";
import { updateSprintStatus } from "@/actions/sprints";

export type SprintStatus = "PLANNED" | "ACTIVE" | "COMPLETED";
import type { Prisma } from "@/lib/generated/prisma/client";
type Sprint = Prisma.SprintGetPayload<{}>;

interface SprintManagerProps {
  sprint: Sprint;
  setSprint: (sprint: Sprint) => void;
  sprints: Sprint[];
  projectId: string;
}

export default function SprintManager({
  sprint,
  setSprint,
  sprints,
  projectId,
}: SprintManagerProps) {
  const router = useRouter();

  const {
    fn: updateStatus,
    loading,
    data: updatedStatus,
  } = useFetch(updateSprintStatus, null);

  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);
  const now = new Date();

  const canStart =
    sprint.status === "PLANNED" &&
    isAfter(now, startDate) &&
    isBefore(now, endDate);

  const canEnd = sprint.status === "ACTIVE";

  const handleStatusChange = async (newStatus: SprintStatus) => {
    await updateStatus(sprint.id, newStatus);
  };

  useEffect(() => {
    if (updatedStatus?.success) {
      setSprint(updatedStatus.sprint);
    }
  }, [updatedStatus, setSprint]);

  const handleSprintChange = (value: string) => {
    const selectedSprint = sprints.find((s) => s.id === value);
    if (!selectedSprint) return;

    setSprint(selectedSprint);
    router.replace(`/project/${projectId}`, undefined);
  };

  const getStatusText = () => {
    if (sprint.status === "COMPLETED") return "Sprint Ended";
    if (sprint.status === "ACTIVE" && isAfter(now, endDate))
      return `Overdue by ${formatDistanceToNow(endDate)}`;
    if (sprint.status === "PLANNED" && isBefore(now, startDate))
      return `Starts in ${formatDistanceToNow(startDate)}`;
    return null;
  };

  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <Select value={sprint.id} onValueChange={handleSprintChange}>
          <SelectTrigger className="bg-slate-950">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sprints.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name} ({format(s.startDate, "MMM d")} –{" "}
                {format(s.endDate, "MMM d")})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {canStart && (
          <Button onClick={() => handleStatusChange("ACTIVE")}>
            Start Sprint
          </Button>
        )}

        {canEnd && (
          <Button
            variant="destructive"
            onClick={() => handleStatusChange("COMPLETED")}
          >
            End Sprint
          </Button>
        )}
      </div>

      {loading && <BarLoader width="100%" className="mt-2" />}

      {getStatusText() && (
        <Badge className="mt-3">{getStatusText()}</Badge>
      )}
    </>
  );
}
