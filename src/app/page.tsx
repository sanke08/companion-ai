import SignInButton from '@/components/SignInButton'
import Image from 'next/image'
import React from 'react'

const page = () => {
  return (
    <div className=' h-screen w-screen flex py-2'>
    <div className=' w-full h-full'>
        <p className=' text-3xl md:px-10 px-3'>Companion.ai</p>
        <div className=' grid justify-center w-full space-y-10'>
            <div className=' w-max mx-auto mt-40 text-2xl lg:text-6xl bg-gradient-to-r from-white/80 to-neutral-800  text-transparent bg-clip-text'>
                Chat with your favourite persone
            </div>
            <SignInButton />
            <Image src={require("../../public/1.png")} alt='' className="  object-contain -z-10 lg:px-10 overflow-hidden" />
        </div>
        <div className=' absolute bottom-0 w-full border-t border-t-neutral-700 my-2 py-2 px-10'>
            copyrights @2024
        </div>
    </div>
</div>
  )
}

export default page