import { FC, useEffect, useState } from "react";
import { BsHeart, BsChat, BsHeartFill } from "react-icons/bs";
import { FiRepeat } from "react-icons/fi";
import { Post, User } from "../types/types";
import {
  useUnlikePostMutation,
  useLikePostMutation,
  useDeletePostMutation,
} from "../services/postApi";
import {
  likePost,
  unlikePost,
  deletePost,
  setImageUrl,
} from "../features/post/postSlice";
import { useAppDispatch } from "../features/app/hooks";
import { useCreateRepostMutation } from "../services/repostApi";
import moment from "moment";
import PostPreviewModal from "./modals/PostPreviewModal";

interface IPostCard {
  post: Post;
  token: string;
  authenticatedUser: User | null;
}

const PostCard: FC<IPostCard> = ({ post, token, authenticatedUser }) => {
  const dispatch = useAppDispatch();
  const [likePostMutation] = useLikePostMutation();
  const [unlikePostMutation] = useUnlikePostMutation();
  const [deletePostMutation] = useDeletePostMutation();
  const [createRepostMutation] = useCreateRepostMutation();
  const [postData, setPostData] = useState<Post | null>(null)
  const [showPostPreviewModal, setShowPostPreviewModal] = useState<boolean>(false)

  const didLike: boolean = post.liked_by.some(
    (user) => user._id === authenticatedUser?._id
  );

  const timeStamp: string = moment(post.createdAt)
    .startOf("minute")
    .fromNow(true);
  const time: string = timeStamp.split(" ")[0];
  const finalTime: string = time === "a" || time === "an" ? "1": time
  const timeUnit: string = timeStamp.split(" ")[1].split("")[0];
  const timeStampFormat: string = finalTime + timeUnit;
  
  function toggleLikeHandler(postId: string, token: string): void {
    if (!authenticatedUser) {
      return;
    }

    if (didLike) {
      dispatch(unlikePost({ postId, user: authenticatedUser }));
      unlikePostMutation({ postId, token });
    } else {
      dispatch(likePost({ postId, user: authenticatedUser }));
      likePostMutation({ postId, token });
    }

  }

  function deletePostHandler(postId: string, token: string): void {
    if (!authenticatedUser) return
    dispatch(deletePost(postId));
    deletePostMutation({ postId, token });
  }

  async function repostHandler(postId: string, token: string): Promise<void> {
    if (!authenticatedUser) {
      return;
    }
    try {
      const repost = await createRepostMutation({ postId, token }).unwrap();
      if (repost) {
        console.log("success ", repost);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function closeModal(): void {
    setPostData(null)
    setShowPostPreviewModal(false)
  }

  useEffect(() =>{
    setPostData(post)
  },[post])

  return (
    <div className="w-full h-auto bg-secondaryBg rounded-3xl p-4">
      {/* modal when the comment icon is clicked */}
      {postData && showPostPreviewModal &&
      <PostPreviewModal 
        postData={postData}
        timeStampFormat={timeStampFormat}
        didLike={didLike}
        toggleLike={toggleLikeHandler}
        repost={repostHandler}
        token={token}
        closeModal={closeModal}
      />}
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
              className="rounded-full w-[35px] h-[35px]"
            />
            <h2 className="text-white font-medium text-sm">
              {post.creator.username}
            </h2>
          </div>
          <div>
            <p className="text-">{timeStampFormat}</p>
            {authenticatedUser?._id === post.creator._id && (
              <p
                className="cursor-pointer"
                onClick={() => deletePostHandler(post._id, token)}
              >
                delete
              </p>
            )}
          </div>
        </div>

        <p className="text-sm text-[#ffffff] tracking-wide whitespace-pre-line">
          {post.content}
        </p>
        {post?.image && (
          <img
            src={post?.image?.url}
            alt=""
            className="w-full rounded-xl cursor-pointer"
            onClick={() =>
              post.image && dispatch(setImageUrl(post?.image?.url))
            }
          />
        )}
        {/* icons */}
        <div className="flex gap-3 items-center">
          {/* heart */}
          <div className="flex gap-1 items-center">
            <p
              className={` text-[1.1rem] p-2 rounded-full hover:bg-[#4e4a4a] ease-in-out duration-300 ${
                didLike ? "text-red-500" : "text-white"
              } `}
              onClick={() => toggleLikeHandler(post._id, token)}
            >
              {didLike ? <BsHeartFill /> : <BsHeart />}
            </p>
            <p className="text-lightText text-sm">{post.likes}</p>
          </div>
          {/* comment */}
          <div className="flex gap-1 items-center">
            <p 
              className="text-white text-[1.1rem] p-2 ronded-full hover:bg-[#4e4a4a] ease-in-out duration-300" 
              onClick={() => {
                setPostData(post)
                setShowPostPreviewModal(true)
              }}
            >
              <BsChat />
            </p>
            <p className="text-lightText text-sm">0</p>
          </div>
          {/* repost */}
          <div className="flex gap-1 items-center">
            <p
              className="text-white text-[1.1rem] p-2 rounded-full hover:bg-[#4e4a4a] ease-in-out duration-300"
              onClick={() => repostHandler(post._id, token)}
            >
              <FiRepeat />
            </p>
            <p className="text-lightText text-sm">0</p>
          </div>
        </div>
        {/* end of iconse */}
      </div>
    </div>
  );
};

export default PostCard;
