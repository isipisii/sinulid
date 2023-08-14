import { JSX }from 'react'

const UserProfileInfoLoader = (): JSX.Element => {
  return (
    <div className='w-full flex flex-col gap-4 p-4 md:p-0'>
      {/* user name, name and image */}
      <div className='flex items-center justify-between'>
        <div className='flex-col flex gap-2'>
            <div className="animate-pulse  bg-[#444444a5] h-[25px] w-[150px] rounded"></div>
            <div className="animate-pulse  bg-[#444444a5] h-[15px] w-[80%] rounded"></div>
        </div>
        <div className="animate-pulse  bg-[#444444a5] h-[80px] w-[80px] rounded-full"></div>
      </div>

      {/* bio and link */}
      <div className='flex flex-col gap-4'>
        <div className="animate-pulse  bg-[#444444a5] h-[10px] w-[50%] rounded"></div>
        <div className="animate-pulse  bg-[#444444a5] h-[10px] w-[70%] rounded"></div>
      </div>

      {/* 2 btns */}
      <div className='flex gap-4'>
        <div className="animate-pulse  bg-[#444444a5] h-[30px] w-full rounded"></div>
        <div className="animate-pulse  bg-[#444444a5] h-[30px] w-full rounded"></div>
      </div>

      <div className='flex gap-4'>
        <div className="animate-pulse  bg-[#444444a5] h-[20px] w-full rounded"></div>
        <div className="animate-pulse  bg-[#444444a5] h-[20px] w-full rounded"></div>
      </div>
    </div>
  )
}

export default UserProfileInfoLoader