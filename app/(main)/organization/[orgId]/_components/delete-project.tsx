"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrganization } from "@clerk/nextjs";
import useFetch from "@/hooks/use-fetch";
import { deleteProject } from "@/actions/projects";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

type DeleteProjectResponse = {
  success: boolean;
};

const DeleteProject = ({ projectId }: { projectId: string }) => {
  const { membership } = useOrganization();
  const router = useRouter();

  
  const {
    loading: isDeleting,
    error,
    fn: deleteProjectFn,
    data: deleted,
  } = useFetch<DeleteProjectResponse | null, [string]>(deleteProject, null);
  
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    await deleteProjectFn(projectId);
    
    // optional: refresh or redirect
    router.refresh();
  };
  useEffect(() => {
    if (deleted?.success) {
      toast.error("Project deleted successfully");
      router.refresh();
    }
  }, [deleted, router]);
  
  const isAdmin = membership?.role === "org:admin";
  if (!isAdmin) return null;

  return (
    <>
    <Button
      variant="ghost"
      size="sm"
      disabled={isDeleting}
      className={isDeleting ? "animate-pulse" : ""}
      onClick={handleDelete}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
    {error && <p className="text-sm text-red-500 mt-2">{error.message}</p>}
    </>
  );
};

export default DeleteProject;
