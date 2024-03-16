import CompanionForm from '@/components/CompanionForm'
import { db } from '@/lib/db'
import React from 'react'

interface Props {
  params: {
    id: string
  }
}

const page = async ({ params }: Props) => {

  const categories = await db.category.findMany({})

  const companion = await db.companion.findFirst({
    where: {
      id: params.id
    }
  })

  return (
    <div className=' w-full py-10'>
      <CompanionForm categories={categories} companion={companion} />
    </div>
  )
}

export default page