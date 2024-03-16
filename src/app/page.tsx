import SignInButton from '@/components/SignInButton'
import { getServerSideUser } from '@/lib/getServerSideUser'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import React from 'react'





const page = async () => {




    return (
        <div className=' h-screen w-screen flex py-2'>
            <div className=' w-full h-full'>
                <p className=' text-3xl px-10'>Companion.ai</p>
                <div className=' grid justify-center w-full space-y-10'>
                    <div className=' w-max mx-auto mt-40 text-6xl bg-gradient-to-r from-white/80 to-neutral-800  text-transparent bg-clip-text'>
                        Chat with your favourite persone
                    </div>
                    <SignInButton />
                    <Image src={require("../../public/1.png")} alt='' className=" object-contain -z-10 px-10 overflow-hidden" />
                </div>
                <div className=' w-full border-t border-t-neutral-700 my-2 py-5 px-10'>
                    copyrights @2024
                </div>
            </div>
        </div>
    )
}

export default page