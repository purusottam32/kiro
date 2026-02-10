"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import UserAvatar from "./user-avatar";
import { useRouter } from "next/navigation";
import type { Prisma } from "@/lib/generated/prisma/client";
import IssueDetailsDialog from "./issue-details-dialog";
import type { IssueWithRelations } from "@/lib/types/prisma";


/* ---------------- TYPES ---------------- */

type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";



type IssueCardProps = {
  issue: IssueWithRelations;
  showStatus?: boolean;
  onDelete?: () => void;
  onUpdate?: (issue: IssueWithRelations) => void;
};

/* ---------------- UI ---------------- */

const priorityColor: Record<Priority, string> = {
  LOW: "bg-green-500",
  MEDIUM: "bg-yellow-400",
  HIGH: "bg-orange-500",
  URGENT: "bg-red-500",
};


export default function IssueCard({
  issue,
  showStatus = false,
  onDelete = () => {},
  onUpdate = () => {},
}: IssueCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const onDeleteHandler = () => {
    // router.refresh();
    onDelete?.();
  };

  const onUpdateHandler = (updated: IssueWithRelations) => {
    // router.refresh();
    onUpdate?.(updated);
  };

  const created = formatDistanceToNow(new Date(issue.createdAt), {
    addSuffix: true,
  });

  return (
    <>
    <Card
      onClick={() => setIsDialogOpen(true)}
      className={`
        cursor-pointer
        bg-neutral-900/80
        border border-neutral-800
        rounded-xl
        transition-all duration-200
        hover:shadow-lg hover:shadow-black/40
        hover:-translate-y-0.5
      `}
    >
      {/* TOP PRIORITY STRIP */}
      <div
        className={`h-1 rounded-t-xl ${priorityColor[issue.priority]}`}
      />

      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold tracking-wide text-white line-clamp-2">
          {issue.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex items-center gap-2 pb-3">
        {showStatus && (
          <Badge variant="secondary" className="text-xs">
            {issue.status}
          </Badge>
        )}

        <Badge
          variant="outline"
          className="text-xs border-neutral-600 text-neutral-300"
        >
          {issue.priority}
        </Badge>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-2">
        <UserAvatar user={issue.assignee ?? undefined} />

        <span className="text-[11px] text-neutral-400">
          {created}
        </span>
      </CardFooter>
    </Card>


    {isDialogOpen && <IssueDetailsDialog
      isOpen={isDialogOpen}
      onClose={()=>setIsDialogOpen(false)}
      issue={issue}
      onDelete={onDeleteHandler}
      onUpdate={onUpdateHandler}
      borderCol={priorityColor[issue.priority]}
    />}
    </>

  );
}
