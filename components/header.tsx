import {
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { PenBox } from "lucide-react";
import UserMenu from "./ui/user-menu";
import { checkUser } from "@/lib/checkUser";
import UserLoading from "./user-loading";

const Header = async () => {
  await checkUser();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-black/70 border-b border-white/10">
      <nav className="container mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="font-extrabold tracking-[0.25em] text-[#0A5BFF]">
          KIRO
        </Link>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          <SignedIn>
            <Link href="/project/create">
              <Button
                size="sm"
                className="bg-[#0A5BFF] hover:bg-[#1F6CFF] gap-2"
              >
                <PenBox size={16} />
                Create Project
              </Button>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/onboarding">
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Login
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserMenu />
          </SignedIn>
        </div>
      </nav>

      <UserLoading />
    </header>
  );
};

export default Header;
