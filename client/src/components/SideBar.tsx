import { FC } from 'react'
import { User } from '../types/types'

interface ISideBar {
    userInfo: User | null
    handleLogout: () => void
}

const SideBar: FC<ISideBar> = ({ userInfo, handleLogout }) => {

  return (
    <aside className='border-slate-600 border p-4 w-[400px] h-[500px] rounded-md'>
        <div className='flex items-center'>
            <h1 className='text-white font-bold text-[2rem]'>{userInfo?.username}</h1>
            <button onClick={handleLogout} className='bg-red-500 text-white'>Log out</button>
        </div>  
    </aside>
  ) 
}

export default SideBar