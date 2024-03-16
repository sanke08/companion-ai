"use client"
import React from 'react'
import { Button } from '../ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

const Categories = () => {
    const searchParams = useSearchParams()
    const router = useRouter()

    return (
        <div className='flex overflow-scroll gap-3'>
            <Button onClick={() => router.replace("/admin/?category=companions")} className={twMerge(' py-2 px-4 bg-neutral-700/30 hover:bg-neutral-500/50 rounded-lg', searchParams?.get("category") === "companions" && "bg-neutral-500/50")}>
                Companions
            </Button>
            <Button onClick={() => router.replace("/admin/?category=users")} className={twMerge(' py-2 px-4 bg-neutral-700/30 hover:bg-neutral-500/50 rounded-lg', searchParams?.get("category") === "users" && " bg-neutral-500/50")}>
                Users
            </Button>
        </div>
    )
}

export default Categories