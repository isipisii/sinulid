import { FC } from "react";
import { BsHeart, BsChat, BsHeartFill } from "react-icons/bs";
import { FiRepeat } from "react-icons/fi";
import { Post, User } from "../types/types";
import { useUnlikePostMutation, useLikePostMutation, useDeletePostMutation } from "../services/postApi";
import { likePost, unlikePost, deletePost } from "../features/post/postSlice";
import { useAppDispatch } from "../features/app/hooks";

interface IPostCard {
  post: Post
  token: string
  authenticatedUser: User | null
}

const PostCard: FC<IPostCard> = ({ post, token, authenticatedUser }) => {
  const dispatch = useAppDispatch()
  const [likePostMutation] = useLikePostMutation()
  const [unlikePostMutation] = useUnlikePostMutation()
  const [deletePostMutation] = useDeletePostMutation()

  const didLiked = post.liked_by.some(user=> user._id === authenticatedUser?._id)
  
  function toggleLikeHandler(postId: string, token: string): void {
    if(authenticatedUser){
      if(didLiked){
        dispatch(unlikePost({postId, user: authenticatedUser}))
        unlikePostMutation({postId, token})
      } else {
        dispatch(likePost({postId, user: authenticatedUser}))
        likePostMutation({postId, token})
      }
    }
  }

  function deletePostHandler(postId: string, token: string):void {
    if(authenticatedUser){
      dispatch(deletePost(postId))
      deletePostMutation({postId, token})
    }
  }

  
  return (
    <div className="w-full h-auto bg-secondaryBg rounded-3xl p-4">
      {/* post infos */} 
      <div className="flex flex-col gap-4 h-auto">
        <div className="flex justify-between text-[#ffffff65] text-xs">
          <div className="flex gap-3 items-center">
            <img
              src={
                post.creator?.displayed_picture
                  ? post.creator?.displayed_picture?.url
                  : "https://greenacresportsmed.com.au/wp-content/uploads/2018/01/dummy-image.jpg"
              }
              alt=""
              className="rounded-full w-[40px] h-[40px]"
            />
            <h2 className="text-white font-medium text-sm">
              {post.creator.username}
            </h2>
          </div>
          <div>
            <p>2h</p>
            {authenticatedUser?._id === post.creator._id && <p className="cursor-pointer" onClick={() => deletePostHandler(post._id, token)}>delete</p>}
          </div>
        </div>

        <p className="text-sm text-[#ffffff] tracking-wide whitespace-pre-line">{post.content}</p>
        {post?.image && (
          <img src={post?.image?.url} alt="" className="w-full rounded-xl" />
        )}
        {/* icons */}
        <div className="flex gap-3 items-center">
          <div className="flex gap-1 items-center">
            <p className={` text-[1.1rem] p-2 rounded-full hover:bg-[#4e4a4a] ease-in-out duration-300 ${didLiked ? "text-red-500" : "text-white" } `} onClick={() => toggleLikeHandler(post._id, token)}>{ didLiked ? <BsHeartFill /> : <BsHeart />}</p>
            <p className="text-lightText text-sm">{post.likes}</p>
          </div>
          <div className="flex gap-1 items-center">
            <p className="text-white text-[1.1rem] p-2 rounded-full hover:bg-[#4e4a4a] ease-in-out duration-300" ><BsChat /></p>
            <p className="text-lightText text-sm">0</p>
          </div>
          <div className="flex gap-1 items-center">
            <p className="text-white text-[1.1rem] p-2 rounded-full hover:bg-[#4e4a4a] ease-in-out duration-300" ><FiRepeat /></p>
            <p className="text-lightText text-sm">0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
