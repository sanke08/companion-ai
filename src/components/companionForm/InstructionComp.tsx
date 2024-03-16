"use client"
import React, { useState } from 'react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { twMerge } from 'tailwind-merge'
import ErrorComponent from '../reuse/ErrorComponent'
import { generatePrompt } from '@/lib/generatePrompt'

interface Props {
    instruction: string
    onChangeInstrution: (val: string) => void
    isDisabled: boolean
    name: string
}



const InstructionComp = ({ instruction, onChangeInstrution, isDisabled, name }: Props) => {


    const [loading, setLoading] = useState(false)

    const handleGenerate = async () => {
        setLoading(true)
        const res = await generatePrompt(name)
        console.log(res)
        if(res){
            onChangeInstrution(res)
        }
        setLoading(false)
    }



    return (
        <>
            <div className=' py-8 border-b pb-2 border-neutral-600'>
                <p className=' font-bold text-2xl'>Congigurations</p>
                <p className=' opacity-50 text-sm'>Detailed instruction for your Companion behavior</p>
            </div>
            <div className="mt-5" >
                <p className=''>Instructions</p>
                <div className='mt-1'>
                    <Textarea value={instruction} onChange={(e) => onChangeInstrution(e.target.value)} placeholder='example You are finiantial character whose name is elon musk. you are entraprenaur and investor.you are a pasion for space exploration ,electric vehical,sustainable energy and advancing technology. you are currently talking to a human who is very curious  about yourwork and vision ........................................' className='h-60 resize-y' />
                </div>
                <ErrorComponent error='' />
                <div className=' flex justify-between mt-1 items-center'>
                    <p className=' opacity-50 text-sm'>Describe in detail your companion&apos;s backstory and relevent details </p>
                    <Button isDisabled={isDisabled} isloading={loading} onClick={handleGenerate} className={twMerge(' bg-gradient-to-tr from-fuchsia-500 to-pink-500 via-purple-500', loading && "from-fuchsia-500/30 to-pink-500/30 via-purple-500/30 text-white/30")}>Generate with Ai</Button>
                </div>
            </div>
        </>
    )
}

export default InstructionComp