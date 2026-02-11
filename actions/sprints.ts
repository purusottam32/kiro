"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { SprintStatus } from "@/lib/generated/prisma/enums";


/* ---------------- TYPES ---------------- */

type CreateSprintData = {
  name: string;
  startDate: Date | string;
  endDate: Date | string;
};

/* ---------------- CREATE SPRINT ---------------- */

export async function createSprint(
  projectId: string,
  data: CreateSprintData
) {
  const { userId, orgId } = await auth();
  const clerk = await clerkClient();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  // 🔒 Admin check
  const { data: memberships } =
    await clerk.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  const isAdmin = memberships.some(
    (m) => m.publicUserData?.userId === userId && m.role === "org:admin"
  );

  if (!isAdmin) {
    throw new Error("Only admins can create sprints");
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: { sprints: { orderBy: { createdAt: "desc" } } },
  });

  if (!project || project.organizationId !== orgId) {
    throw new Error("Project not found");
  }

  const sprint = await db.sprint.create({
    data: {
      name: data.name,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      status: "PLANNED",
      projectId,
    },
  });

  return sprint;
}

/* ---------------- UPDATE SPRINT STATUS ---------------- */

export async function updateSprintStatus(
  sprintId: string,
  newStatus: SprintStatus
) {
  const { userId, orgId, orgRole } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }



  const sprint = await db.sprint.findUnique({
    where: { id: sprintId },
    include: { project: true },
  });
  console.log(sprint,orgRole);
  if (!sprint) {
    throw new Error("Sprint not found");
  }

  if (sprint.project.organizationId !== orgId) {
    throw new Error("Unauthorized");
  }
  if (orgRole !== "org:admin") {
      throw new Error("Only Admin can make this change");
  }
  const now = new Date();
  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);

  if (
    newStatus === "ACTIVE" &&
    (now < startDate || now > endDate)
  ) {
    throw new Error("Cannot start sprint outside its date range");
  }

  if (
    newStatus === "COMPLETED" &&
    sprint.status !== "ACTIVE"
  ) {
    throw new Error("Can only complete an active sprint");
  }

  const updatedSprint = await db.sprint.update({
    where: { id: sprintId },
    data: { status: newStatus },
  });

  return {
    success: true,
    sprint: updatedSprint,
  };
}
