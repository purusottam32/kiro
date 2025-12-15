"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createSprint(
  projectId: string,
  data: {
    name: string;
    startDate?: Date | string;
    endDate?: Date | string;
  }
) {
  const clerk = await clerkClient();
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  // 🔒 Check org admin
  const { data: memberships } =
    await clerk.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  const isAdmin = memberships.some(
    (m) =>
      m.publicUserData?.userId === userId && m.role === "org:admin"
  );

  if (!isAdmin) {
    throw new Error("Only organization admins can create sprints");
  }

  // 🔍 Verify project ownership
  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.organizationId !== orgId) {
    throw new Error("Project not found or access denied");
  }

  // 📅 Safe date handling
  const startDate = data.startDate
    ? new Date(data.startDate)
    : undefined;

  const endDate = data.endDate
    ? new Date(data.endDate)
    : undefined;

  // ✅ Create sprint
  const sprint = await db.sprint.create({
    data: {
      name: data.name,
      status: "PLANNED",
      projectId,
       ...(startDate && { startDate }), 
      ...(endDate && { endDate }),     
    },
  });

  return sprint;
}


