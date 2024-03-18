import UserBar from '@/components/admin/UserBar'
import { db } from '@/lib/db'
import React from 'react'

const page = async () => {
    const users = await db.user.findMany({
        where: {
            role: {
                not: "ADMIN"
            }
        },
        orderBy:{
            id:"asc"
        }
    })

    return (
        <div className=' space-y-2 w-full md:px-20'>
            {
                users.map((user) => (
                    <UserBar key={user.id} user={user} />
                ))
            }
        </div>
    )
}

export default page