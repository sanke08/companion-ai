import Sidebar from '@/components/Sidebar'
import Categories from '@/components/admin/Categories'
import Header from '@/components/admin/Header'
import { getServerSideUser } from '@/lib/getServerSideUser'
import React from 'react'

const layout = async ({ children }: { children: React.ReactNode }) => {
    const user = await getServerSideUser()
    if (!user) return
    return (
        <div className=' w-full h-full'>
            <Header user={user} />
            <div className='flex pt-[65px] md:pl-[100px]'>
                <Sidebar />
                <div className=' p-5 w-full'>
                    <Categories />
                    {children}
                </div>
            </div>
        </div>
    )
}

export default layout