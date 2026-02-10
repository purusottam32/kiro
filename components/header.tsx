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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-black/80 via-black/60 to-black/80 border-b border-white/10 shadow-lg shadow-blue-500/5">
      <nav className="container mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="font-extrabold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-[#0A5BFF] to-[#3D87FF] hover:from-[#1F6CFF] hover:to-[#5B9EFF] transition-all duration-300">
          KIRO
        </Link>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          <SignedIn>
            <Link href="/project/create">
              <Button
                size="sm"
                className="bg-gradient-to-r from-[#0A5BFF] to-[#3D87FF] hover:from-[#1F6CFF] hover:to-[#5B9EFF] gap-2 text-white font-semibold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200"
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
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-200"
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
