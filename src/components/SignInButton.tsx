"use client"

import React from 'react'
import { Button } from './ui/button'
import { signIn } from 'next-auth/react'

const SignInButton = () => {
    return (
        <Button onClick={() => signIn("google")} className=' bg-gradient-to-tr from-violet-700 via-fuchsia-600 to-pink-500  px-28 py-6 mx-auto w-max text-xl'>Get started</Button>
    )
}

export default SignInButton