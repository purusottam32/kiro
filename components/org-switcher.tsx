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
            variables: {
              colorBackground: "#0f172a",
              colorInputBackground: "#1e293b", 
              colorInputText: "#f1f5f9",
              colorNeutral: "#94a3b8",
              colorPrimary: "#0A5BFF",
              colorTextOnPrimaryBackground: "#ffffff",
              colorTextSecondary: "#cbd5e1",
            },
            elements: {
              organizationSwitcherTrigger: "border-2 border-slate-600 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 rounded-xl bg-slate-800/30 hover:bg-slate-700/50 px-4 py-2.5 font-semibold text-white transition-all duration-300",
              organizationSwitcherTriggerIcon: "text-blue-400",
              organizationPreviewMainIdentifier: "font-semibold text-white",
              organizationSwitcherPopoverContainer: "shadow-lg shadow-slate-950/50",
            },
          }}
        />
      </SignedIn>
    </div>
  );
};

export default OrgSwitcher;
