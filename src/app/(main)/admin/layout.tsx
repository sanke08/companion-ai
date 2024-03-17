import Categories from '@/components/admin/Categories'
import { getServerSideUser } from '@/lib/getServerSideUser'
import React from 'react'

const layout = async ({ children }: { children: React.ReactNode }) => {

    const user = await getServerSideUser()
    const isAdmin = user?.role === "ADMIN"
    return (
        <div className=' w-full min-h-screen p-4'>
            <Categories isAdmin={isAdmin}/>
            {children}
        </div>
    )
}

export default layout