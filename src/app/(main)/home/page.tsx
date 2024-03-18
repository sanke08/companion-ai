import Categorie from '@/components/Categorie'
import Image from 'next/image'
import React, { Suspense } from 'react'
import Link from 'next/link'
import Searchbar from '@/components/Searchbar'
import { db } from '@/lib/db'


interface Props {
  searchParams: {
    name: string | undefined
    category: string | undefined
  }
}

async function page({ searchParams }: Props) {

  const verification = await db.verification.findMany({
    where: {
      Companion: {
        category: searchParams.category || undefined,
        name: {
          contains: searchParams.name || undefined
        }
      }
    },
    include: {
      Companion: true
    }
  })

  const companions = verification.map(verification => verification.Companion)

  const categories = await db.category.findMany()

  if (!companions) return (
    <div>
      No
    </div>
  )

  return (
    <div className=' w-full p-2 px-3'>
      <Searchbar />
        <Categorie categories={categories} />
        <div className=' grid grid-cols-2 py-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4'>
          {
            companions && companions.map((companion) => (
              <Link href={`/chat/${companion.id}`} key={companion.id} className=" w-full h-full rounded-xl bg-neutral-700/30 hover:bg-neutral-700/50 p-5 transition-all duration-300 flex flex-col">
                <div className=' w-full relative aspect-square overflow-hidden object-cover rounded-lg'>
                  <Image src={companion.avatar || ""} alt='' fill className=' hover:scale-[1.05] transition-all duration-500' />
                </div>
                <p className=' text-neutral-4 text-lg mx-auto'>{companion.name} </p>
                <p className=' text-neutral-500 text-xs mx-auto'>{companion.description}  </p>
              </Link>
            ))
          }
        </div>
    </div>
  )
}

export default page



const Skeleton = () => {
  return (
    <div>
      <div className=' flex w-full space-x-3'>
        {
          [...Array(10)].map((i, j) => (
            <div key={j} className=' py-4 w-20 bg-neutral-700/30 rounded-lg bg-neutral-800 animate-pulse' />
          ))
        }
      </div>

      <div className=' grid grid-cols-2 py-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4'>
        {
          [...Array(12)].map((i, j) => (
            <div key={j} className=" w-full h-full rounded-xl bg-neutral-800 p-5 transition-all duration-300 flex flex-col space-y-2">
              <div className=' w-full relative aspect-square overflow-hidden object-cover rounded-lg bg-neutral-700/50 animate-pulse' />
              <p className=' text-neutral-4 text-lg w-32 py-3  bg-neutral-700 mx-auto animate-pulse rounded-lg' />
              <p className=' text-neutral-500 mx-auto animate-pulse w-40 py-3 bg-neutral-700 rounded-lg' />
            </div>
          ))
        }
      </div>


    </div>
  )
}