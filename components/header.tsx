import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import { PenBox } from 'lucide-react'
import UserMenu from './ui/user-menu'
import { checkUser } from '@/lib/checkUser'
import UserLoading from './user-loading'

const Header = async () => {
    await checkUser();
  return (
        <header className='container mx-auto'>
            <nav className='px-4 flex justify-between items-center'>
                <Image src={"/logo.svg"} className='h-20 w-auto mt-2' alt="logo" width={200} height={60} />
                
                
                <div className='flex items-center gap-4'>
                    <Link href="/project/create">
                        <Button variant="destructive">
                            <PenBox size={18}/>
                            <span>Create Project</span>
                        </Button>
                    </Link>
                    <SignedOut>
                        <SignInButton forceRedirectUrl="/onboarding">
                            <Button variant="outline">
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
}

export default Header