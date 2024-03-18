import UserBar from '@/components/admin/UserBar'
import { db } from '@/lib/db'
import React from 'react'

const page = async () => {
    const users = await db.user.findMany({
        where: {
            role: {
                not: "ADMIN"
            }
        }
    })

    if (!users) return

    return (
        <div className=' space-y-2 w-full md:px-20'>
            {
                users.map(user => (
                    <div key={user.id}>
                        <UserBar key={user.id} user={user} />
                    </div>
                ))
            }
        </div>
    )
}

export default page