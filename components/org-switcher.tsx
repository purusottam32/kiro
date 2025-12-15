"use client";

import { usePathname } from "next/navigation";
import {
  OrganizationSwitcher,
  SignedIn,
  useOrganization,
  useUser,
} from "@clerk/nextjs";

const OrgSwitcher = () => {
  const pathname = usePathname();
  const { isLoaded: isUserLoaded,isSignedIn } = useUser();
  const { isLoaded: isOrgLoaded } = useOrganization();

  if (pathname === "/") return null;
  if (!isOrgLoaded || !isUserLoaded) return null;
  if (!isSignedIn) return null;
  return (
    <div className="flex justify-end mt-1">
      <SignedIn>
        <OrganizationSwitcher
          hidePersonal
          createOrganizationMode="navigation"
          createOrganizationUrl="/onboarding"
          afterCreateOrganizationUrl="/organization/:slug"
          afterSelectOrganizationUrl="/organization/:slug"
          appearance={{
            elements: {
              organizationSwitcherTrigger:
                "border border-gray-300 rounded-md px-5 py-2",
              organizationSwitcherTriggerIcon: "text-white",
            },
          }}
        />
      </SignedIn>
    </div>
  );
};

export default OrgSwitcher;
