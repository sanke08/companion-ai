
import { User } from '@prisma/client'
import Image from 'next/image'
import React from 'react'
import VerifiedToggle from './VerifiedToggle'

interface Props {
    user: User
} 


const UserBar = ({ user }: Props) => {
    return (
        <div className=' p-2 items-center grid grid-cols-4 border-b border-neutral-800'>
            <div className=' w-20 h-20 relative rounded-full overflow-hidden'>
                {/* @ts-ignore */}
                <Image src={user.avatar} alt='' fill />
            </div>
            <div className=''>
                <p >{user.name}</p>
                <p className=' text-neutral-500'>{user.email}</p>
            </div>
            <VerifiedToggle activeTitle={"Moderator"} type="user" deactiveTitles="User" active={user.role === "MODERATOR"} id={user.id} />
        </div>
    )
}

export default UserBar