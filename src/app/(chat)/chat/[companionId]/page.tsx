import Chatinput from '@/components/Chatinput'
import Header from '@/components/Header'
import MessageContaier from '@/components/MessageContaier'
import { db } from '@/lib/db'
import { getServerSideUser } from '@/lib/getServerSideUser'
import React from 'react'




interface Props {
  params: {
    companionId: string
  }
}


const page = async ({ params }: Props) => {

  const user = await getServerSideUser()
  if (!user) return
  const companion = await db.companion.findUnique({
    where: {
      id: params.companionId
    },
    select: {
      name: true,
      avatar: true
    }
  })
  if (!companion) return

  return (
    <div className=' w-full flex flex-col h-screen'>
      <Header companionName={companion.name} companionAvatar={companion.avatar} />
      <MessageContaier  userAvatar={user?.avatar} companionAvatar={companion.avatar} userName={user.name} compqnionName={companion.name} />
      <Chatinput companionId={params.companionId} companionName={companion.name}/>
    </div>
  )
}

export default page