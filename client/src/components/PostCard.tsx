import { FC, useEffect, useState, useCallback } from "react";
import { BsHeart, BsChat, BsHeartFill } from "react-icons/bs";
import { FiRepeat } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { Post, Reply, User } from "../types/types";
import {
  useUnlikePostMutation,
  useLikePostMutation,
  useDeletePostMutation,
  useLazyGetPostRepliesQuery,
} from "../services/postApi";
import {
  likePost,
  unlikePost,
  deletePost,
  setImageUrl,
} from "../features/post/postSlice";
import { useAppDispatch } from "../features/app/hooks";
import { useCreateRepostMutation } from "../services/repostApi";
import { useFormatTimeStamp } from "../hook/useFormatTimestamp";
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
  const [getPostReplies] = useLazyGetPostRepliesQuery();

  const [postReplies, setPostReplies] = useState<Reply[]>([]);
  const [postData, setPostData] = useState<Post | null>(null);
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [showPostPreviewModal, setShowPostPreviewModal] =
    useState<boolean>(false);
  const { formattedTimeStamp } = useFormatTimeStamp(post.createdAt);

  const didLike: boolean = post.liked_by.some(
    (user) => user._id === authenticatedUser?._id
  );

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

  async function deletePostHandler(
    postId: string,
    token: string
  ): Promise<void> {
    if (!authenticatedUser) return;

    try {
      await deletePostMutation({ postId, token }).unwrap();
      dispatch(deletePost(postId));
      setShowContextMenu(false)
    } catch (error) {
      console.error(error);
    }
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
    setPostData(null);
    setShowPostPreviewModal(false);
  }

  const getReplies = useCallback(async () => {
    if (!postData) return;
    try {
      const replies = await getPostReplies(postData?._id).unwrap();
      if (replies) {
        setPostReplies(replies);
      }
    } catch (error) {
      console.error(error);
    }
  }, [postData, getPostReplies]);
  
  //this will fetch all the post replies on each post card
  useEffect(() => {
    
    getReplies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getReplies]);

  useEffect(() => {
    setPostData(post);
  }, [post]);

  return (
    <div className="w-full h-auto p-4 border-t border-borderColor relative">
      {/* context menu */}
      {showContextMenu && (
        <div className="bg-[#171717] absolute right-5 top-10 rounded-md h-auto z-10 w-[120px]">
          <p className="w-full text-white text-xs border-[#82818154] border-b p-3 text-left font-semibold">
            Edit
          </p>
          <p
            className="w-full text-red-600 text-xs p-3 text-left font-semibold"
            onClick={() => deletePostHandler(post._id, token) }
          >
            Delete
          </p>
        </div>
      )}
      {/* modal when the chat icon is clicked */}
      {postData && showPostPreviewModal && (
        <PostPreviewModal
          postData={postData}
          didLike={didLike}
          toggleLike={toggleLikeHandler}
          repost={repostHandler}
          closeModal={closeModal}
          postReplies={postReplies}
          setPostReplies={setPostReplies}
        />
      )}
      {/* post infos */}
      <div className="flex gap-3 h-auto w-full ">
        <img
          src={
            post.creator?.displayed_picture
              ? post.creator?.displayed_picture?.url
              : "https://greenacresportsmed.com.au/wp-content/uploads/2018/01/dummy-image.jpg"
          }
          alt="profile picture"
          className="rounded-full w-[35px] h-[35px]"
        />

        <div className="w-full flex-col flex gap-2">
          {/* post creator and other details */}
          <div className="flex items-center w-full justify-between">
            <h2 className="text-white font-medium text-xs">
              {post.creator.username}
            </h2>
            <div className="flex items-center gap-3">
              <p className="text-xs text-lightText">{formattedTimeStamp}</p>
              {authenticatedUser?._id === post.creator._id && (
                <p className="cursor-pointer text-base text-white" onClick={() => setShowContextMenu(prevState => !prevState)}>
                  <BsThreeDots />
                </p>
              )}
            </div>
          </div>
          {/*end of post creator and other details */}

          {/* post content */}
          <p className="text-xs text-[#ffffff] tracking-wide whitespace-pre-line">
            {post.content}
          </p>
          {post?.image && (
            <img
              src={post?.image?.url}
              alt="post image"
              className=" w-full rounded-md cursor-pointer object-cover max-w-[500px] transition-transform transform-gpu ease-linear duration-100 active:scale-[.98]"
              onClick={() =>
                post.image && dispatch(setImageUrl(post?.image?.url))
              }
            />
          )}
          {/*end of post content */}

          {/* icons */}
          <div className="flex gap-2 items-center">
            {/* heart */}
            <div className="flex gap-1 items-center">
              <p
                className={` text-[1.3rem] p-2 rounded-full hover:bg-[#4e4a4a] ease-in-out duration-300 cursor-pointer ${
                  didLike ? "text-red-500" : "text-white"
                } `}
                onClick={() => toggleLikeHandler(post._id, token)}
              >
                {didLike ? (
                  <BsHeartFill className="transition-transform transform-gpu ease-linear duration-100 active:scale-90" />
                ) : (
                  <BsHeart className="transition-transform transform-gpu ease-linear duration-100 active:scale-90" />
                )}
              </p>
              <p className="text-lightText text-xs">{post.likes}</p>
            </div>
            {/* comment */}
            <div className="flex gap-1 items-center">
              <p
                className="text-white text-[1.3rem] p-2 rounded-full hover:bg-[#4e4a4a] ease-in-out duration-300 cursor-pointer"
                onClick={() => {
                  setPostData(post);
                  setShowPostPreviewModal(true);
                }}
              >
                <BsChat className="transition-transform transform-gpu ease-linear duration-100 active:scale-90" />
              </p>
              <p className="text-lightText text-xs">{postReplies.length}</p>
            </div>
            {/* repost */}
            <div className="flex gap-1 items-center">
              <p
                className="text-white text-[1.3rem] p-2 rounded-full hover:bg-[#4e4a4a] ease-in-out duration-300 cursor-pointer"
                onClick={() => repostHandler(post._id, token)}
              >
                <FiRepeat className="transition-transform transform-gpu ease-linear duration-100 active:scale-90" />
              </p>
              <p className="text-lightText text-xs">0</p>
            </div>
          </div>
          {/* end of icons */}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
