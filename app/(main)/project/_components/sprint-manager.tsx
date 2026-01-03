"use client";

import { useEffect, useState, Dispatch, SetStateAction } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";
import { updateSprintStatus } from "@/actions/sprints";
import type { Prisma } from "@/lib/generated/prisma/client";

/* ---------------- TYPES ---------------- */

type Sprint = Prisma.SprintGetPayload<{}>;

type UpdateSprintStatusResponse = {
  success: boolean;
  sprint: Sprint;
};

interface SprintManagerProps {
  sprint: Sprint;
  setSprint: Dispatch<SetStateAction<Sprint>>;
  sprints: Sprint[];
  projectId: string;
}

/* ---------------- COMPONENT ---------------- */

export default function SprintManager({
  sprint,
  setSprint,
  sprints,
  projectId,
}: SprintManagerProps) {
  const [status, setStatus] = useState(sprint.status);

  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    fn: updateStatus,
    loading,
    data: updatedStatus,
  } = useFetch(
    updateSprintStatus,
    { success: false, sprint }
  );

  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);
  const now = new Date();

  /* ---------------- STATUS LOGIC ---------------- */

  const canStart =
    status === "PLANNED" &&
    isAfter(now, startDate) &&
    isBefore(now, endDate);

  const canEnd = status === "ACTIVE";

  const handleStatusChange = async (newStatus: typeof sprint.status) => {
    await updateStatus(sprint.id, newStatus);
  };

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    if (updatedStatus.success) {
      setStatus(updatedStatus.sprint.status);
      setSprint(updatedStatus.sprint);
    }
  }, [updatedStatus, setSprint]);

  useEffect(() => {
    const sprintId = searchParams.get("sprint");
    if (sprintId && sprintId !== sprint.id) {
      const selectedSprint = sprints.find((s) => s.id === sprintId);
      if (selectedSprint) {
        setSprint(selectedSprint);
        setStatus(selectedSprint.status);
      }
    }
  }, [searchParams, sprints, sprint.id, setSprint]);

  /* ---------------- HELPERS ---------------- */

  const getStatusText = (): string | null => {
    if (status === "COMPLETED") return "Sprint Ended";
    if (status === "ACTIVE" && isAfter(now, endDate))
      return `Overdue by ${formatDistanceToNow(endDate)}`;
    if (status === "PLANNED" && isBefore(now, startDate))
      return `Starts in ${formatDistanceToNow(startDate)}`;
    return null;
  };

  const handleSprintChange = (value: string) => {
    const selectedSprint = sprints.find((s) => s.id === value);
    if (!selectedSprint) return;

    setSprint(selectedSprint);
    setStatus(selectedSprint.status);
    router.replace(`/project/${projectId}`, undefined);
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <Select value={sprint.id} onValueChange={handleSprintChange}>
          <SelectTrigger className="bg-slate-950 self-start">
            <SelectValue placeholder="Select Sprint" />
          </SelectTrigger>
          <SelectContent>
            {sprints.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name} ({format(s.startDate, "MMM d, yyyy")} to{" "}
                {format(s.endDate, "MMM d, yyyy")})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {canStart && (
          <Button
            onClick={() => handleStatusChange("ACTIVE")}
            disabled={loading}
            className="bg-green-900 text-white"
          >
            Start Sprint
          </Button>
        )}
        {canEnd && (
          <Button
            onClick={() => handleStatusChange("COMPLETED")}
            disabled={loading}
            variant="destructive"
          >
            End Sprint
          </Button>
        )}
      </div>

      {loading && (
        <BarLoader width="100%" className="mt-2" color="#36d7b7" />
      )}

      {getStatusText() && (
        <Badge variant="destructive" className="mt-3 ml-1 self-start">
          {getStatusText()}
        </Badge>
      )}
    </>
  );
}
