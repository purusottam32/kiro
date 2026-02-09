"use client";

import React, { useEffect, useRef } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { issueSchema } from "@/app/lib/validators";
import { createIssue } from "@/actions/issues";
import { getOrganizationUsers } from "@/actions/organizations";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MDEditor from "@uiw/react-md-editor";
import { toast } from "sonner";
import type { Prisma } from "@/lib/generated/prisma/client";
import { z } from "zod";
import { IssueStatus } from "@/lib/generated/prisma/enums";

/* ---------------- TYPES ---------------- */

type IssueCreationDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  sprintId?: string | null;
  status: IssueStatus;
  projectId: string;
  onIssueCreated: () => void;
  orgId: string;
};

type OrgUser = Prisma.UserGetPayload<{}>;
type IssueFormData = z.infer<typeof issueSchema>;

/* ---------------- COMPONENT ---------------- */

const IssueCreationDrawer: React.FC<IssueCreationDrawerProps> = ({
  isOpen,
  onClose,
  sprintId,
  status,
  projectId,
  onIssueCreated,
  orgId,
}) => {
  const {
    loading: createIssueLoading,
    fn: createIssueFn,
    error,
    data: newIssue,
  } = useFetch(createIssue);

  const {
    loading: usersLoading,
    fn: fetchUsers,
    data: users,
  } = useFetch<OrgUser[]>(getOrganizationUsers);

const fetchedRef = useRef(false);

useEffect(() => {
  if (!isOpen || !orgId) return;
  if (fetchedRef.current) return;

  fetchedRef.current = true;
  fetchUsers(orgId);
}, [isOpen, orgId]);

useEffect(() => {
  if (!isOpen) {
    fetchedRef.current = false;
  }
}, [isOpen]);


  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      priority: "MEDIUM",
      description: "",
      assigneeId: "",
    },
  });

  const onSubmit = async (data: IssueFormData) => {
    if (createIssueLoading) return;

    await createIssueFn(projectId, {
      ...data,
      assigneeId: data.assigneeId || null,
      status,
      sprintId,
    });
  };


  useEffect(() => {
    if (!newIssue) return;

    reset();
    onClose();
    onIssueCreated();
    toast.success("Issue added successfully");
  }, [newIssue]);


  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Issue</DrawerTitle>
           <DrawerDescription>
              Fill the details to create a new issue.
            </DrawerDescription>
        </DrawerHeader>

        {usersLoading && <BarLoader width="100%" />}

        <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(onSubmit)(e);
              }} 
              className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input {...register("title")} />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Assignee</label>
            <Controller
              name="assigneeId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {users?.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name ?? "Unnamed"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <MDEditor value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Priority
            </label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {error && <p className="text-red-500">{error.message}</p>}

          <Button type="button" disabled={createIssueLoading} className="w-full" onClick={handleSubmit(onSubmit)}>
            {createIssueLoading ? "Creating..." : "Create Issue"}
          </Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default IssueCreationDrawer;
