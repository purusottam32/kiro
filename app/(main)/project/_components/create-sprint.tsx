"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSprint } from "@/actions/sprints";
import { addDays, format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { sprintSchema } from "@/app/lib/validators";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import { useRouter } from "next/navigation";
import { z } from "zod";
import "react-day-picker/style.css";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

/* ---------------- TYPES ---------------- */

type SprintFormData = z.infer<typeof sprintSchema>;

/* ---------------- COMPONENT ---------------- */

const SprintCreationForm = ({
  projectId,
  projectTitle,
  projectKey,
  sprints,
}: {
  projectId: string;
  projectTitle: string;
  projectKey: string;
  sprints: number;
}) => {
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const { loading: createSprintLoading, fn: createSprintFn } =
    useFetch(createSprint);

  // ✅ DateRange is UI state ONLY
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 14),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SprintFormData>({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      name: `${projectKey}-${sprints}`,
    },
  });

  /* ---------------- SUBMIT ---------------- */

  const onSubmit = async (data: SprintFormData) => {
    if (!dateRange.from || !dateRange.to){
      toast.error("Please select a valid date range");
      return;   
    }

   try{
     await createSprintFn(projectId, {
      name: data.name,                
      startDate: dateRange.from,      
      endDate: dateRange.to,          
    });

    toast.success("Sprint created successfully");
    setShowForm(false);
    router.refresh();
   }catch(error: any){
    toast.error(error.message || "Failed to create sprint");
   }
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-5xl font-bold gradient-title">
          {projectTitle}
        </h1>

        <Button
          onClick={() => setShowForm((prev) => !prev)}
          variant={showForm ? "destructive" : "default"}
        >
          {showForm ? "Cancel" : "Create New Sprint"}
        </Button>
      </div>

      {showForm && (
        <Card className="pt-4 mb-4">
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex gap-4 items-end"
            >
              {/* Sprint Name */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Sprint Name
                </label>
                <Input
                  readOnly
                  className="bg-slate-950"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Sprint Duration (UI only) */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Sprint Duration
                </label>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start text-left bg-slate-950"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from && dateRange.to ? (
                        `${format(dateRange.from, "LLL dd, y")} - ${format(
                          dateRange.to,
                          "LLL dd, y"
                        )}`
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto" align="start">
                    <DayPicker
                      mode="range"
                      selected={dateRange}
                      disabled={{ before: new Date() }}
                      onSelect={(range) => {
                        if (range?.from && range?.to) {
                          setDateRange(range);
                        }
                      }}
                      classNames={{
                        range_start: "bg-blue-700",
                        range_end: "bg-blue-700",
                        range_middle: "bg-blue-400",
                        today: "border-2 border-blue-700",
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Submit */}
              <Button type="submit" disabled={createSprintLoading}>
                {createSprintLoading ? "Creating..." : "Create Sprint"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default SprintCreationForm;
