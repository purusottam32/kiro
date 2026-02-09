"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useOrganization, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { projectSchema } from "@/app/lib/validators";
import { createProject } from "@/actions/projects";
import { BarLoader } from "react-spinners";
import OrgSwitcher from "@/components/org-switcher";
import { z } from "zod";
import type { Project } from "@/lib/types/prisma";

/* ---------------- TYPES ---------------- */

type ProjectFormData = z.infer<typeof projectSchema>;



/* ---------------- COMPONENT ---------------- */

export default function CreateProjectPage() {
  const router = useRouter();
  const hasRedirected = useRef(false);

  const { isLoaded: isOrgLoaded, membership } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();

  const [isAdmin, setIsAdmin] = useState(false);

  /* ---------------- FORM ---------------- */

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  /* ---------------- FETCH ---------------- */

  const {
    loading,
    error,
    data: project,
    fn: createProjectFn,
  } = useFetch<Project>(createProject);

  /* ---------------- EFFECTS ---------------- */

  // Admin check
  useEffect(() => {
    if (isOrgLoaded && isUserLoaded && membership) {
      setIsAdmin(membership.role === "org:admin");
    }
  }, [isOrgLoaded, isUserLoaded, membership]);

  // Redirect after creation
  useEffect(() => {
    if (project?.id && !hasRedirected.current) {
      hasRedirected.current = true;
      router.push(`/project/${project.id}`);
    }
  }, [project, router]);

  /* ---------------- HANDLERS ---------------- */

  const onSubmit = async (data: ProjectFormData) => {
    if (!isAdmin) return;
    await createProjectFn(data);
  };

  /* ---------------- GUARDS ---------------- */

  if (!isOrgLoaded || !isUserLoaded) return null;

  if (!isAdmin) {
    return (
      <div className="flex flex-col gap-2 items-center">
        <span className="text-2xl gradient-title">
          Oops! Only Admins can create projects.
        </span>
        <OrgSwitcher />
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-6xl text-center font-bold mb-8 gradient-title">
        Create New Project
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        <div>
          <Input
            {...register("name")}
            className="bg-slate-950"
            placeholder="Project Name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <Input
            {...register("key")}
            className="bg-slate-950"
            placeholder="Project Key (Ex: RCYT)"
          />
          {errors.key && (
            <p className="text-red-500 text-sm mt-1">
              {errors.key.message}
            </p>
          )}
        </div>

        <div>
          <Textarea
            {...register("description")}
            className="bg-slate-950 h-28"
            placeholder="Project Description"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {loading && <BarLoader width="100%" color="#36d7b7" />}

        <Button type="submit" disabled={loading} size="lg">
          {loading ? "Creating..." : "Create Project"}
        </Button>

        {error && <p className="text-red-500">{error.message}</p>}
      </form>
    </div>
  );
}
