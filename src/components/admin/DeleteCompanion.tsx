"use client"
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { DialogClose } from '../ui/dialog'


interface Props {
    name: string
    id: string
    avatar: string
}


const DeleteCompanion = ({ name, id, avatar }: Props) => {
    return (
        <div className=' space-y-5'>
            <div className='space-y-2 mx-auto w-fit'>
                <div className=' w-40 h-40 rounded-lg relative overflow-hidden '>
                    <Image src={avatar} alt=' ' fill />
                </div>
                <p className=' text-center'>{name}</p>
            </div>
            <p className=' text-rose-500 mx-auto w-fit'>The data related about companion deleted permenantly</p>
            <div className=' w-full flex gap-5 justify-between pt-5'>
                    <DialogClose className=' w-full border border-neutral-600 rounded-md hover:bg-neutral-800/30'>
                        Cancle
                    </DialogClose>
                <Button variant={"primary"} className=" text-black w-full" >Remove</Button>
            </div>
        </div>
    )
}

export default DeleteCompanion