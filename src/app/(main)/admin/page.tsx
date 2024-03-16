import CompanionBars from '@/components/admin/CompanionBars'
import UserBar from '@/components/admin/UserBar'
import { db } from '@/lib/db'
import React from 'react'


interface Props {
    searchParams: {
        category: "companions" | "users" | ""
    }
}



const page = async ({ searchParams }: Props) => {


    if (searchParams.category === "companions" || !searchParams.category) {
        const companions = await db.companion.findMany(({
            include: {
                Creator: {
                    select: {
                        name: true
                    }
                },
            },
        }))
        if (!companions) return
        const verification = await db.verification.findMany({})
        return (
            <div className=' space-y-2 w-full md:px-20'>
                {
                    companions.map(companion => {
                        const isVerified = verification.find(({ companionId }) => companion.id === companionId)
                        return <CompanionBars key={companion.id} companion={companion} isVerified={!!isVerified} />
                    })
                }
            </div>
        )
    }

    if (searchParams.category === "users") {
        const users = await db.user.findMany({
            where: {
                // role: {
                //     not: "ADMIN"
                // }
            }
        })
        return (
            <div className=' space-y-2 w-full md:px-20'>
                {
                    users.map(user => (
                        <UserBar key={user.id} user={user} />
                    ))
                }
            </div>
        )
    }
}

export default page
