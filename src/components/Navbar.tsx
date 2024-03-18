"use client"
import React from 'react'
import { Button } from './ui/button'
import { signIn, signOut } from 'next-auth/react'
import { User } from '@prisma/client'
import Avatar from './Avatar'
import { LogOut } from 'lucide-react'


interface Props {
    user: User | null
}


const Navbar = ({ user }: Props) => {
    return (
        <div className=' w-full flex justify-between h-[65px] z-50 bg-neutral-900  border-b-2 border-neutral-500/20 left-0 fixed top-0 px-5 items-center'>
            <p className=' text-2xl md:text-3xl'>companion.ai</p>
            {
                user ?
                    <div className=' flex gap-2 items-center'>
                        <Avatar imgUrl={user.avatar} name={user.name} />
                        <Button onClick={() => signOut({ redirect: true })} className=' border border-neutral-500 '><LogOut className=' w-5 h-5'/>  </Button>
                    </div>
                    :
                    <Button onClick={() => signIn("google")} className=' border border-neutral-500'>Sign-in</Button>
            }
        </div>
    )
}

export default Navbar