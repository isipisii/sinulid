import { FC } from 'react'
import { useAppSelector, useAppDispatch } from '../../features/app/hooks'
import { setImageUrl } from '../../features/post/postSlice'
import { IoMdClose } from "react-icons/io";

const ViewImageModal: FC = () => {
  const { viewImage } = useAppSelector(state => state.post)
  const dispatch = useAppDispatch()

  return (
    <> 
    {viewImage &&
      <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center bg-[#000000f1]  backdrop-blur-sm z-20">
        <p  className="top-5 right-5 text-[#525151] text-[1.2rem] md:text-[1.5rem] absolute p-2 md:p-3 font-thin rounded-full bg-[#252424ce] hover:bg-[#424141ba] cursor-pointer" onClick={() => dispatch(setImageUrl(""))}>
          <IoMdClose />
        </p>
        <div className="max-w-[100vw] md:max-w-[70vw] max-h-[100vh] md:h-[100vh]">
          <img src={viewImage} alt="post image" className='w-full h-full mx-auto'/>
        </div>
      </div>
      }
    </>
  )
}

export default ViewImageModal