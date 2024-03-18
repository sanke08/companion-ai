import Chatinput from '@/components/Chatinput'
import Header from '@/components/Header'
import MessageContaier from '@/components/MessageContaier'
import { db } from '@/lib/db'
import { getServerSideUser } from '@/lib/getServerSideUser'
import { redis } from '@/lib/redis'
import React from 'react'


interface Props {
  params: {
    companionId: string
  }
}


const page = async ({ params }: Props) => {

  const user = await getServerSideUser()
  if (!user) return
  // const redis = await redis()

  const cashedCompanion = (await redis.hgetall(`companion-${params.companionId}`)) as { avatar: string, name: string }

  let companion: { name: string, avatar: string } | null = null

  if (!cashedCompanion) {
    companion = await db.companion.findUnique({
      where: {
        id: params.companionId
      },
      select: {
        name: true,
        avatar: true
      }
    })
    if (companion) {
      await redis.hset(`companion-${params.companionId}`, companion)
    }
  }


  if (!companion && !cashedCompanion) return

  return (
    <div className=' w-full flex flex-col h-screen'>
      <Header companionName={companion?.name ?? cashedCompanion?.name} companionAvatar={companion?.avatar ?? cashedCompanion.avatar} />
      <MessageContaier userAvatar={user?.avatar} companionAvatar={companion?.avatar ?? cashedCompanion.avatar} userName={user.name} compqnionName={companion?.name ?? cashedCompanion.name} />
      <Chatinput companionId={params.companionId} companionName={companion?.name ?? cashedCompanion.name} />
    </div>
  )
}

export default page