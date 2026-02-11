"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IssueWithAssignee } from "@/lib/types/prisma";

const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

type BoardFiltersProps = {
  issues: IssueWithAssignee[];
  filters: {
    search: string;
    assignees: string[];
    priority: string;
  };
  onChange: (filters: BoardFiltersProps["filters"]) => void;
};

export default function BoardFilters({
  issues,
  filters,
  onChange,
}: BoardFiltersProps) {
  const assignees = Array.from(
    new Map(
      issues
        .map((i) => i.assignee)
        .filter((a): a is NonNullable<typeof a> => !!a)
        .map((a) => [a.id, a])
    ).values()
  );

  const clearFilters = () => {
    onChange({ search: "", assignees: [], priority: "" });
  };

  const isFiltersApplied =
    filters.search ||
    filters.assignees.length > 0 ||
    filters.priority;

  return (
    <div className="flex flex-wrap gap-3 mt-8 p-4 bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl border border-white/5 items-center">
      <Input
        className="w-72 bg-slate-800/50 border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 placeholder-slate-500"
        placeholder="Search issues..."
        value={filters.search}
        onChange={(e) =>
          onChange({ ...filters, search: e.target.value })
        }
      />

      <div className="flex gap-2 items-center">
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Assignees:</span>
        {assignees.map((assignee) => {
          const selected = filters.assignees.includes(assignee.id);
          return (
            <div
              key={assignee.id}
              className={`rounded-full ring-2 cursor-pointer transition-all duration-200 ${
                selected ? "ring-blue-500 shadow-lg shadow-blue-500/30" : "ring-slate-700 hover:ring-blue-400"
              }`}
              onClick={() =>
                onChange({
                  ...filters,
                  assignees: selected
                    ? filters.assignees.filter((id) => id !== assignee.id)
                    : [...filters.assignees, assignee.id],
                })
              }
              title={assignee.name}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={assignee.imageUrl || undefined} alt={assignee.name || "User"} />
                <AvatarFallback>{assignee.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
            </div>
          );
        })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isFiltersApplied && (
        <Button variant="ghost" onClick={clearFilters} className="text-slate-400 hover:text-red-400 hover:bg-red-500/10">
          <X className="h-4 w-4 mr-2" /> Clear
        </Button>
      )}
    </div>
  );
}
