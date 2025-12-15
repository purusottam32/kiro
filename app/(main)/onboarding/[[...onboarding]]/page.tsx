"use client";

import {
  OrganizationList,
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const Onboarding = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const { organization } = useOrganization();

  // Prevent double redirects in React Strict Mode (dev)
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!isLoaded || hasRedirected.current) return;

    if (!isSignedIn) {
      hasRedirected.current = true;
      router.replace("/sign-in");
      return;
    }

    if (organization?.slug) {
      hasRedirected.current = true;
      router.replace(`/organization/${organization.slug}`);
    }
  }, [isLoaded, isSignedIn, organization, router]);

  // ⏳ Wait until Clerk is ready
  if (!isLoaded) return null;

  // 🔐 Redirecting or already in an org → render nothing
  if (!isSignedIn || organization) return null;

  return (
    <div className="flex justify-center items-center pt-14">
      <OrganizationList
        hidePersonal
        afterCreateOrganizationUrl="/organization/:slug"
        afterSelectOrganizationUrl="/organization/:slug"
      />
    </div>
  );
};

export default Onboarding;
