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
        bg-gradient-to-br from-slate-800/60 via-slate-900/40 to-slate-900/60
        border border-slate-700/50 hover:border-blue-500/50
        rounded-xl
        transition-all duration-300
        hover:shadow-xl hover:shadow-blue-500/10
        hover:-translate-y-1
        group
      `}
    >
      {/* TOP PRIORITY STRIP WITH GLOW */}
      <div
        className={`h-1.5 rounded-t-xl ${priorityColor[issue.priority]} shadow-lg transition-all group-hover:h-2`}
      />

      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold tracking-wide text-white line-clamp-2 group-hover:text-blue-300 transition-colors">
          {issue.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex items-center gap-2 pb-3 flex-wrap">
        {showStatus && (
          <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30">
            {issue.status}
          </Badge>
        )}

        <Badge
          variant="outline"
          className="text-xs border-slate-600 text-slate-300 bg-slate-700/30 hover:bg-slate-700/50"
        >
          {issue.priority}
        </Badge>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-2">
        <UserAvatar user={issue.assignee ?? undefined} />

        <span className="text-[11px] text-slate-400 group-hover:text-slate-300 transition-colors">
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
