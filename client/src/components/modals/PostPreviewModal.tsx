import { FC } from "react";
import { Post } from "../../types/types";
import { IoMdClose } from "react-icons/io";
import { BsHeart, BsChat, BsHeartFill } from "react-icons/bs";
import { FiRepeat } from "react-icons/fi";

interface IPostPreviewModal {
  postData: Post | null;
  closeModal: () => void;
  timeStampFormat: string;
  didLike: boolean
  toggleLike: (postId: string, token: string) => void
  repost: (postId: string, token: string) => Promise<void>
  token: string
}

const PostPreviewModal: FC<IPostPreviewModal> = ({ postData, closeModal, timeStampFormat, didLike, repost, toggleLike, token}) => {
  
  return (
    <div className="bg-[#00000081] fixed w-[100vw] h-[100vh] z-10 top-0 left-0 flex items-center justify-center">
      <p
        className="top-2 right-2 text-white text-[1.3rem] absolute p-1 rounded-full bg-[#3d3d3dad] hover:bg-[#4f4c4c] cursor-pointer"
        onClick={closeModal}
      >
        <IoMdClose />
      </p>
      <div className="w-[600px] h-auto flex items-center">
        {/* post image */}
        {postData?.image && (
          <img src={postData?.image?.url} alt="" className="w-full" />
        )}
        {/* end of post image */}
        <div className="bg-matteBlack h-[400px] w-[600px] p-4 rounded-3xl flex gap-4 flex-col">
          {/*post creator*/}
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <img
                src={
                  postData?.creator?.displayed_picture
                    ? postData.creator?.displayed_picture?.url
                    : "https://greenacresportsmed.com.au/wp-content/uploads/2018/01/dummy-image.jpg"
                }
                alt=""
                className="rounded-full w-[35px] h-[35px]"
              />
              <h2 className="text-white font-medium text-sm">{postData?.creator.username}</h2>
            </div>
            <p className="text-lightText text-xs">{timeStampFormat}</p>
          </div>
          {/* end of post creator*/}

          {/* post content */}
          <p className="text-sm text-[#ffffff] tracking-wide whitespace-pre-line">{postData?.content}</p>

          {/* icons */}
          <div className="flex gap-3 items-center">
            {/* heart */}
            <div className="flex gap-1 items-center">
              <p
                className={` text-[1.1rem] p-2 rounded-full hover:bg-[#4e4a4a] ease-in-out duration-300 ${
                  didLike ? "text-red-500" : "text-white"
                } `}
                onClick={() => { 
                  if(!postData) return 
                  toggleLike(postData?._id, token)
                }}
              >
                {didLike ? <BsHeartFill /> : <BsHeart />}
              </p>
              <p className="text-lightText text-sm">{postData?.likes}</p>
            </div>
            {/* comment */}
            <div className="flex gap-1 items-center">
              <p className="text-white text-[1.1rem] p-2 rounded-full hover:bg-[#4e4a4a] ease-in-out duration-300">
                <BsChat />
              </p>
              <p className="text-lightText text-sm">0</p>
            </div>
            {/* repost */}
            <div className="flex gap-1 items-center">
              <p
                className="text-white text-[1.1rem] p-2 rounded-full hover:bg-[#4e4a4a] ease-in-out duration-300"
                onClick={() =>{
                  if(!postData) return 
                  repost(postData?._id, token)
                }}
              >
                <FiRepeat />
              </p>
              <p className="text-lightText text-sm">0</p>
            </div>
          </div>
          {/* end of icons */}
        </div>
      </div>
    </div>
  );
};

export default PostPreviewModal;


