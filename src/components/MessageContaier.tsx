"use client"
import { selectChatLoadingState } from '@/lib/redux/slices/ChatLoader';
import { clearMessages, selectChatState } from '@/lib/redux/slices/ChatSlice';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { twMerge } from 'tailwind-merge';
import Avatar from './Avatar';
import { useChatScroll } from '@/hook/useScroll';


interface Props {
    userAvatar: string | null
    companionAvatar: string | null
    userName: string
    compqnionName: string
}



const MessageContaier = ({ companionAvatar, userAvatar, userName, compqnionName }: Props) => {

    const dispatch = useDispatch()

    const { messages } = useSelector(selectChatState);
    const { loading } = useSelector(selectChatLoadingState)
    const ref = useChatScroll(messages);
    const [fkLoading, setFkLoading] = useState(true)



    useEffect(() => {
        dispatch(clearMessages())
        setTimeout(() => {
            setFkLoading(false)
        }, 1000);
    }, [dispatch])




    return (
        <div ref={ref} className='flex-1 h-full overflow-y-auto'>
            {
                !fkLoading &&
                <div className={twMerge(' flex gap-1 p-2')}>
                    <Avatar imgUrl={companionAvatar} name={compqnionName} />
                    <div className=' min-w-60 max-w-[50%] px-5 py-2 h-max rounded-xl bg-neutral-500/20'>
                        hello, {userName}
                    </div>
                </div>
            }
            {
                messages && messages.map((message, i) => (
                    <div key={i} className={twMerge(' flex gap-1 p-2', message?.role === "user" ? " flex-row-reverse" : " flex-row")}>

                        {
                            message?.role === "user" ?
                                <Avatar imgUrl={userAvatar} name={userName} />
                                :
                                <Avatar imgUrl={companionAvatar} name={compqnionName} />
                        }
                        <div className=' min-w-60 max-w-[50%] px-5 py-2 h-max rounded-xl bg-neutral-500/20'>
                            {message?.parts.length ?
                                message.parts.split('\n').map((paragraph, index) => (
                                    <p key={index}>{paragraph.replace(/\*/g, '').replace(/\*\s+/g, ',\n* ')}</p>
                                ))
                            :
                            <p className=' text-rose-400 text-sm'>something went wrong please try again</p>}
                        </div>
                    </div>
                ))
            }
            {
                (loading || fkLoading) &&
                <div className={twMerge(' flex gap-1 p-2')}>
                    <Avatar imgUrl={companionAvatar} name={compqnionName} />
                    <div className=' min-w-60 max-w-[50%] px-5 py-5 h-max rounded-xl bg-neutral-500/20 animate-pulse transition-all duration-1000'>
                    </div>
                </div>
            }
        </div>
    )
}

export default MessageContaier