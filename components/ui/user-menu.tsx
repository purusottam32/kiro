"use client"
import { UserButton } from '@clerk/nextjs'
import { ChartNoAxesGantt } from 'lucide-react'
import React from 'react'

const UserMenu = () => {
  return (
    <UserButton appearance={{
            elements:{
                avatarBox: "w-30 h-30",
            }
        
    }}>
        <UserButton.MenuItems>
            <UserButton.Link
                label="My Organizations"
                labelIcon={<ChartNoAxesGantt size={15}/>}
                href='/onboarding'
            />
        </UserButton.MenuItems>

    </UserButton>
  )
}

export default UserMenu