"use client"

import Image from 'next/image'
import React from 'react'
import FileUploader from '../FileUploader'
import { X } from 'lucide-react'


interface Props {
    ImageUrl: string
    onCancle: () => void
    onChangeUrl: (val: string) => void
}



const UploadAvaterCompanion = ({ ImageUrl, onCancle, onChangeUrl }: Props) => {
    return (
        <div className=' mt-5 mx-auto flex justify-center w-40 h-40'>

            {
                ImageUrl ?
                    <div className=' w-40 h-40 relative overflow-hidden bg-neutral-600/50 rounded-2xl'>
                        <Image src={ImageUrl} alt='' fill className=' absolute' />
                        <X onClick={() => onCancle()} className=' cursor-pointer absolute top-1 right-1 bg-rose-500 rounded-full h-7 w-7 p-10.5' />
                    </div>
                    :
                    <FileUploader endpoint={"imageUploader"} onchange={(value: any) => onChangeUrl(value)} />
            }


        </div>
    )
}

export default UploadAvaterCompanion