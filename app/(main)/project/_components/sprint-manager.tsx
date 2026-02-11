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
type Sprint = Prisma.SprintGetPayload<Record<string, never>>;

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
      <div className="flex justify-between items-center gap-4 p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-2xl border border-white/10 mb-2">
        <div className="flex-1">
          <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2 block">Current Sprint</label>
          <Select value={sprint.id} onValueChange={handleSprintChange}>
            <SelectTrigger className="bg-slate-800/50 border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 text-white font-semibold">
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
        </div>

        <div className="flex gap-2 items-end">
          {canStart && (
            <Button onClick={() => handleStatusChange("ACTIVE")} className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg shadow-green-500/20">
              Start Sprint
            </Button>
          )}

          {canEnd && (
            <Button
              variant="destructive"
              onClick={() => handleStatusChange("COMPLETED")}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold shadow-lg shadow-red-500/20"
            >
              End Sprint
            </Button>
          )}

          {!canStart && !canEnd && (
            <Badge variant="secondary" className={`text-xs font-semibold py-1.5 px-3 ${
              sprint.status === "COMPLETED" ? "bg-gray-600 text-gray-100" : 
              sprint.status === "ACTIVE" ? "bg-green-600/30 text-green-300 border-green-500/50" : 
              "bg-blue-600/30 text-blue-300 border-blue-500/50"
            }`}>
              {sprint.status}
            </Badge>
          )}
        </div>
      </div>

      {loading && <BarLoader width="100%" className="mt-2 rounded-full" color="#0A5BFF" />}

      {sprint.status === "ACTIVE" && isAfter(now, endDate) && (
        <Badge className="mt-3 bg-red-500/20 text-red-300 border-red-500/50 font-semibold">
          Overdue by {formatDistanceToNow(endDate)}
        </Badge>
      )}
    </>
  );
}
