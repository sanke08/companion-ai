import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { getServerSideUser } from '@/lib/getServerSideUser'
import React from 'react'

interface Props {
    children: React.ReactNode
}


const layout = async ({ children }: Props) => {


    const user = await getServerSideUser()


    return (

        <div className=' w-full'>
            <Navbar user={user} />
            <div className=' w-full flex pt-[65px] md:pl-[100px]'>
                <Sidebar />
                {children}
            </div>
        </div>
    )
}

export default layout