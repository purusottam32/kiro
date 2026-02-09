"use client";

import { useState, useEffect } from "react";
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
import { updateSprintStatus } from "@/actions/sprints";
import type { Prisma } from "@/lib/generated/prisma/client";

export type SprintStatus = "PLANNED" | "ACTIVE" | "COMPLETED";
type Sprint = Prisma.SprintGetPayload<{}>;

interface SprintManagerProps {
  sprint: Sprint;
  setSprint: React.Dispatch<React.SetStateAction<Sprint | null>>;
  sprints: Sprint[];
  projectId: string;
}

export default function SprintManager({
  sprint,
  setSprint,
  sprints,
}: SprintManagerProps) {
  const {
    fn: updateStatus,
    loading,
    data,
  } = useFetch(updateSprintStatus, null);

  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  // ✅ update ONLY when server confirms change
  useEffect(() => {
    if (!data?.success) return;
    if (data.sprint.id !== sprint.id) return;

    setSprint(data.sprint);
  }, [data, sprint.id, setSprint]);

  if (!now) return null;

  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);

  const canStart =
    sprint.status === "PLANNED" &&
    isAfter(now, startDate) &&
    isBefore(now, endDate);

  const canEnd = sprint.status === "ACTIVE";

  const handleSprintChange = (value: string) => {
    if (value === sprint.id) return;

    const next = sprints.find((s) => s.id === value);
    if (!next) return;

    setSprint(next);
  };

  const handleStatusChange = async (status: SprintStatus) => {
    await updateStatus(sprint.id, status);
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

      {sprint.status === "ACTIVE" && isAfter(now, endDate) && (
        <Badge className="mt-3">
          Overdue by {formatDistanceToNow(endDate)}
        </Badge>
      )}
    </>
  );
}
