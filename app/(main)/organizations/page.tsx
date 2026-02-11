"use client";

import { useUser, useOrganizationList } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OrganizationsPage() {
  const { isLoaded: isUserLoaded, user } = useUser();
  const { isLoaded: isOrgListLoaded, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isUserLoaded || !isOrgListLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <BarLoader color="#0A5BFF" />
          <p className="text-slate-400 mt-4">Loading organizations...</p>
        </div>
      </div>
    );
  }

  const organizations = userMemberships?.data || [];

  if (organizations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            No Organizations
          </h1>
          <p className="text-slate-400 mb-8">
            You don't have any organizations yet. Create one to get started!
          </p>
          
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">
          My Organizations
        </h1>
        <p className="text-slate-400 mb-8">
          Select an organization to view its projects
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {organizations.map((membership) => (
            <button
              key={membership.organization.id}
              onClick={() =>
                router.push(`/organization/${membership.organization.slug}`)
              }
              className="group p-6 rounded-2xl bg-linear-to-br from-slate-800/50 via-slate-900/60 to-slate-900/40 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 text-left"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {membership.organization.name}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    {membership.role}
                  </p>
                </div>
                {membership.organization.imageUrl && (
                  <img
                    src={membership.organization.imageUrl}
                    alt={membership.organization.name}
                    className="w-12 h-12 rounded-lg"
                  />
                )}
              </div>
              <p className="text-xs text-slate-500 font-mono">
                {membership.organization.slug}
              </p>
            </button>
          ))}
        </div>

 
      </div>
    </div>
  );
}
