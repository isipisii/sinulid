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
  setPostToEdit,
} from "../features/post/postSlice";
import {
  likePostInUserProfile,
  unlikePostInUserProfile,
  deletePostInUserProfile,
} from "../features/user/userProfileSlice";
import { useAppDispatch } from "../features/app/hooks";
import { useCreateRepostMutation } from "../services/repostApi";
import { useFormatTimeStamp } from "../hook/useFormatTimestamp";
import { Link } from "react-router-dom";
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
  const [showPostPreviewModal, setShowPostPreviewModal] = useState<boolean>(false);
  const { formattedTimeStamp } = useFormatTimeStamp(post.createdAt);

  const didLike: boolean = post.liked_by.some(
    (user) => user._id === authenticatedUser?._id
  );

  function toggleLikeHandler(postId: string, token: string): void {
    if (!authenticatedUser) {
      return;
    }

    if (didLike) {
      dispatch(unlikePost({ postId, user: authenticatedUser })); // for feed's optimistic update
      dispatch(unlikePostInUserProfile({ postId, user: authenticatedUser })); // for user's profile optimistic update
      unlikePostMutation({ postId, token });
    } else {
      dispatch(likePost({ postId, user: authenticatedUser })); // for feed's optimistic update
      dispatch(likePostInUserProfile({ postId, user: authenticatedUser })); // for user's profile optimistic update
      likePostMutation({ postId, token });
    }
  }

  async function deletePostHandler(postId: string, token: string): Promise<void> {
    if (!authenticatedUser) return;

    try {
      await deletePostMutation({ postId, token }).unwrap();
      dispatch(deletePostInUserProfile(postId)); // for user's profile optimistic update
      dispatch(deletePost(postId)); // for feed's optimistic update
      setShowContextMenu(false);
    } catch (error) {
      console.error(error);
    }
  }

  // get the users' image url who replied on a certain post 
  function getUserImageUrls(): string[] {
    const imageUrls: string[] = [];

    postReplies.forEach((reply) => {
      if (!reply.creator.displayed_picture) return;
      if (imageUrls.includes(reply.creator.displayed_picture?.url)) return;
      imageUrls.push(reply.creator.displayed_picture?.url);
    });

    return imageUrls;
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
          <p
            className="w-full text-white text-xs border-[#82818154] border-b p-3 text-left cursor-pointer"
            onClick={() => {
              dispatch(setPostToEdit(post));
              setShowContextMenu(false);
            }}
          >
            Edit
          </p>
          <p
            className="w-full text-red-600 text-xs p-3 text-left cursor-pointer"
            onClick={() => deletePostHandler(post._id, token)}
          >
            Delete
          </p>
        </div>
      )}
      {/* end of context menu */}

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
      <div className="flex gap-2 h-auto w-full ">
        <div className="items-center flex flex-col gap-3">
          <div className=" w-[40px] h-[40px]">
            <img
              src={
                post.creator?.displayed_picture
                  ? post.creator?.displayed_picture?.url
                  : "https://greenacresportsmed.com.au/wp-content/uploads/2018/01/dummy-image.jpg"
              }
              alt="profile picture"
              className="rounded-full w-[40px] h-[40px] object-cover"
            />
          </div>

          {/* line */}
          {/* will only show when there's a reply */}
          {postReplies.length > 0 && (
            <div className="h-full relative">
              <svg
                width="2"
                height="100%"
                viewBox="0 0 2 100%"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className="absolute top-0 left-0 "
              >
                <path
                  d="M1 1L1.01805 2000"
                  stroke="#B0A2A2"
                  stroke-opacity="0.73"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="stroke-[#ffffff4d] stroke-2"
                />
              </svg>
            </div>
          )}
          {/* end of line */}

          {/* users who replied */}
          {postReplies.length > 0 && (
            <div
              className={`h-[30px] w-[39px] ${
                getUserImageUrls().length >= 2
                  ? "relative pb-3"
                  : "flex items-center justify-center"
              }`}
            >
              {getUserImageUrls().map((imageUrl, index) => (
                <img
                  src={imageUrl}
                  alt=""
                  className={`h-[20px] w-[20px] object-cover rounded-full 
                  ${
                    index === 0 && getUserImageUrls().length >= 2
                      ? "absolute top-1 right-0 h-[20px] w-[20px]"
                      : null
                  }
                  ${
                    index === 1 && getUserImageUrls().length >= 2
                      ? "absolute top-1 left-0 h-[16px] w-[16px]"
                      : null
                  }
                  ${
                    index === 2 && getUserImageUrls().length > 2
                      ? "absolute top-0 right-0 left-0 mx-auto h-[12px] w-[12px]"
                      : "null"
                  }
                  `}
                />
              ))}
            </div>
          )}
          {/*end of users who replied */}
        </div>

        <div className="w-full flex-col flex gap-1">
          {/* post creator and other details */}
          <div className="flex items-center w-full justify-between">
            <Link to={`/profile/${post.creator.username}`}>
              <h2 className="text-white font-medium text-xs">
                {post.creator.username}
              </h2>
            </Link>
            <div className="flex items-center gap-1">
              <p className="text-xs text-lightText">{formattedTimeStamp}</p>
              {authenticatedUser?._id === post.creator._id && (
                <p
                  className="cursor-pointer text-base text-white rounded-full hover:bg-[#4e4a4a] ease-in-out duration-300 p-1"
                  onClick={() => setShowContextMenu((prevState) => !prevState)}
                >
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
              className=" w-full mt-2 rounded-md cursor-pointer object-cover max-w-[500px] transition-transform transform-gpu ease-linear duration-100 active:scale-[.98]"
              onClick={() =>
                post.image && dispatch(setImageUrl(post?.image?.url))
              }
            />
          )}
          {/*end of post content */}

          {/* icons */}
          <div className="flex items-center my-1 ml-[-.5rem]">
            {/* heart */}
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

            {/* comment */}
            <p
              className="text-white text-[1.3rem] p-2 rounded-full hover:bg-[#4e4a4a] ease-in-out duration-300 cursor-pointer"
              onClick={() => {
                setPostData(post);
                setShowPostPreviewModal(true);
              }}
            >
              <BsChat className="transition-transform transform-gpu ease-linear duration-100 active:scale-90" />
            </p>
            {/* repost */}
            <p
              className="text-white text-[1.3rem] p-2 rounded-full hover:bg-[#4e4a4a] ease-in-out duration-300 cursor-pointer"
              onClick={() => repostHandler(post._id, token)}
            >
              <FiRepeat className="transition-transform transform-gpu ease-linear duration-100 active:scale-90" />
            </p>
          </div>
          {/* end of icons */}
          
          {/* reply and like count */}
          <p className="text-[#7b7575] text-xs flex items-center gap-1">
            {postReplies.length > 0 && (
              <span
                onClick={() => {
                  setPostData(post);
                  setShowPostPreviewModal(true);
                }}
                className="cursor-pointer hover:underline underline-offset-2"
              >
                {" "}
                {postReplies.length}{" "}
                {postReplies.length > 1 ? "replies" : "reply"}
              </span>
            )}
            {postReplies.length > 0 && post.likes > 0 && <span>·</span>}
            {post.likes > 0 && (
              <span className="cursor-pointer hover:underline underline-offset-2">
                {post.likes} {post.likes > 1 ? "likes" : "like"}
              </span>
            )}
          </p>
         {/* end of reply and like count */}     
        </div>
      </div>
    </div>
  );
};

export default PostCard;
