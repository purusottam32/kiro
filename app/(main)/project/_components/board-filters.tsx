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

const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

type BoardFiltersProps = {
  issues: any[];
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
        .filter((i) => i.assignee)
        .map((i) => [i.assignee.id, i.assignee])
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
    <div className="flex flex-wrap gap-4 mt-6">
      <Input
        className="w-72"
        placeholder="Search issues..."
        value={filters.search}
        onChange={(e) =>
          onChange({ ...filters, search: e.target.value })
        }
      />

      <div className="flex gap-2">
        {assignees.map((assignee) => {
          const selected = filters.assignees.includes(assignee.id);

          return (
            <div
              key={assignee.id}
              className={`rounded-full ring cursor-pointer ${
                selected ? "ring-blue-600" : "ring-transparent"
              }`}
              onClick={() =>
                onChange({
                  ...filters,
                  assignees: selected
                    ? filters.assignees.filter((id) => id !== assignee.id)
                    : [...filters.assignees, assignee.id],
                })
              }
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={assignee.imageUrl ?? ""} />
                <AvatarFallback>
                  {assignee.name?.[0] ?? "?"}
                </AvatarFallback>
              </Avatar>
            </div>
          );
        })}
      </div>

      <Select
        value={filters.priority}
        onValueChange={(value) =>
          onChange({ ...filters, priority: value })
        }
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          {priorities.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isFiltersApplied && (
        <Button variant="ghost" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" /> Clear
        </Button>
      )}
    </div>
  );
}
