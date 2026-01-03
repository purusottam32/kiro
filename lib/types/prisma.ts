import type { Prisma } from "@/lib/generated/prisma/client";

/* ---------- SHARED PRISMA TYPES ---------- */

export type IssueWithAssignee = Prisma.IssueGetPayload<{
  include: {
    assignee: true;
    reporter: true;
  };
}>;

export type IssueWithRelations = Prisma.IssueGetPayload<{
  include: {
    assignee: true;
    reporter: true;
  };
}>;

export type UserBasic = Prisma.UserGetPayload<{}>;
export type UserMinimal = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    imageUrl: true;
  };
}>;
