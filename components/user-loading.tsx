"use client";
import { useOrganization, useUser } from "@clerk/nextjs";
import React from "react";
import { BarLoader } from "react-spinners";

const UserLoading = () => {
  const { isLoaded: isUserLoaded, isSignedIn } = useUser();
  const { isLoaded: isOrgLoaded } = useOrganization();

  if (!isOrgLoaded || !isUserLoaded) {
    return (
      <BarLoader className="mb-4" width={100} color="#36d7b7" />
    );
  }

  if (!isSignedIn) return null;
  return null;
};

export default UserLoading;