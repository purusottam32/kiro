import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { IssueStatus, IssuePriority } from "@/lib/generated/prisma/enums";

type CreateIssueData = {
  title: string;
  description?: string;
  status: IssueStatus;
  priority: IssuePriority;
  sprintId?: string;
  assigneeId?: string;
};

export async function createIssue(projectId: string,Data: CreateIssueData) {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      throw new Error("Unauthorized");
    }
    const user=await db.user.findUnique({
      where:{clerkUserId:userId}
    });
    
    if(!user){
      throw new Error("User not found");
    }
    const lastIssue = await db.issue.findFirst({
      where: { projectId, status: Data.status ||undefined },
      orderBy: { createdAt: "desc" },
    }); 

    const newOrder = lastIssue ? lastIssue.order + 1 : 0;

    const issue = await db.issue.create({
      data: {
        title: Data.title,
        description: Data.description ,
        status: Data.status ,
        priority: Data.priority,
        projectId: projectId,
        sprintId: Data.sprintId,
        reporterId: user.id,
        assigneeId: Data.assigneeId || null,
        order: newOrder,
        },
        include:{
            assignee:true,
            reporter:true,

        }
    });
    return issue;
}