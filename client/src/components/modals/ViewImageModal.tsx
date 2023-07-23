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
      <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center bg-[#090808af] z-10">
        <p className="top-2 right-2 text-white text-[1.3rem] absolute p-1 rounded-full bg-[#3d3d3dad] hover:bg-[#4f4c4c] cursor-pointer" onClick={() => dispatch(setImageUrl(""))}>
          <IoMdClose />
        </p>
        <div className="max-w-[100vh] md:max-w-[70vw] max-h-[100vh] ">
          <img src={viewImage} alt="post image" className='w-full h-auto mx-auto'/>
        </div>
      </div>
      }
    </>
  )
}

export default ViewImageModal