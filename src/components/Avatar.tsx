import Image from 'next/image'
import React from 'react'
import CustomTooltip from './reuse/CustomTooltip'


interface Props {
    imgUrl: string | null
    name: string
}


const Avatar = ({ imgUrl, name }: Props) => {
    return (
        <CustomTooltip message={name} >
            {
                imgUrl ?
                    <div className=' relative w-12 h-12 rounded-full overflow-hidden'>
                        <Image src={imgUrl} alt='' fill className=' absolute w-full h-full' />
                    </div>
                    :
                    <p>
                        {name[0]}
                    </p>
            }
        </CustomTooltip>
    )
}

export default Avatar