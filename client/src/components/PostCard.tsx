import { FC, useEffect, useState, useCallback } from "react";
import { BsHeart, BsChat, BsHeartFill } from "react-icons/bs";
import { FiRepeat } from "react-icons/fi";
import { TbRepeat, TbRepeatOff } from "react-icons/tb";
import { BsThreeDots } from "react-icons/bs";
import { Post, Reply, Repost, User } from "../types/types";
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
  likePostOrRepostInUserProfile,
  unlikePostOrRepostInUserProfile,
  deletePostOrRepostInUserProfile,
  addRepostInUserProfile,
} from "../features/user/userProfileSlice";

import {
  useCreateRepostMutation,
  useRemoveRepostMutation,
} from "../services/repostApi";

import { useAppDispatch, useAppSelector } from "../features/app/hooks";
import { useFormatTimeStamp } from "../util/useFormatTimestamp";
import { bubbleStyleUserImageWhoReplied } from "../util/bubbleStyle";
import { Link } from "react-router-dom";
import PostPreviewModal from "./modals/PostPreviewModal";

interface IPostCard {
  post: Post;
  token: string;
  authenticatedUser: User | null;
  repost?: Repost;
  type?: string;
  isReposted?: boolean
}

const PostCard: FC<IPostCard> = ({ post, token, authenticatedUser, repost, isReposted }) => {
  const dispatch = useAppDispatch();

  const [likePostMutation] = useLikePostMutation();
  const [unlikePostMutation] = useUnlikePostMutation();
  const [deletePostMutation] = useDeletePostMutation();
  const [createRepostMutation] = useCreateRepostMutation();
  const [removeRepostMutation] = useRemoveRepostMutation();
  const [getPostReplies] = useLazyGetPostRepliesQuery();

  const [postReplies, setPostReplies] = useState<Reply[]>([]);
  const [postData, setPostData] = useState<Post | null>(null);
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [showPostPreviewModal, setShowPostPreviewModal] = useState<boolean>(false);
  const { formattedTimeStamp } = useFormatTimeStamp(post.createdAt);
  const { userPostsAndReposts } = useAppSelector(state => state.userProfile)

  const didLike: boolean = post.liked_by.some(
    (user) => user._id === authenticatedUser?._id
  );
  
  // 
  function toggleLikeHandler(postId: string, token: string): void {
    if (!authenticatedUser) {
      return;
    }

    if (didLike) {
      dispatch(
        unlikePostOrRepostInUserProfile({ postId, user: authenticatedUser })
      ); // for user's profile optimistic update
      dispatch(unlikePost({ postId, user: authenticatedUser })); // for feed's optimistic update
      unlikePostMutation({ postId, token });
    } else {
      dispatch(
        likePostOrRepostInUserProfile({ postId, user: authenticatedUser })
      ); // for user's profile optimistic update
      dispatch(likePost({ postId, user: authenticatedUser })); // for feed's optimistic update
      likePostMutation({ postId, token });
    }
  }

  async function deletePostHandler(postId: string, token: string): Promise<void> {
    if (!authenticatedUser) return;
  
    try {
      // Delete the original post
      await deletePostMutation({ postId, token });

      dispatch(deletePostOrRepostInUserProfile({postId, repostId: repost?._id})); // for user's profile optimistic update
      dispatch(deletePost(postId)); // for feed's optimistic update
      setShowContextMenu(false);
    } catch (error) {
      console.error(error);
    }
  }

  // gets the users' image unique url who replied on a certain post
  function getUserImageUrls(): string[] {
    const imageUrls: string[] = [];

    for (const reply of postReplies) {

      if(!reply.creator.displayed_picture) break

      if(!imageUrls.includes(reply.creator.displayed_picture?.url)){
        imageUrls.push(reply.creator.displayed_picture?.url);
      }
      if(imageUrls.length > 3) break
    }
    return imageUrls;
  }

  async function toggleRepostHandler(postId: string): Promise<void> {
    // collects the list of the current user's repost 
      const userReposts = userPostsAndReposts.filter((item) => {
        if (item.type === "repost") {
          const repost = item as Repost;
          return repost;
        }
      }) as Repost[];

      // if a post card is marked as reposted, then it will remove the repost
      if (isReposted) {
        // retrieving the repost to remove by checking if this card is being reposted by the user
        const repostToRemove = userReposts?.find(repost => repost.post._id === post._id)

        if(repostToRemove) {
          await removeRepostMutation({token, repostId: repostToRemove?._id})
          dispatch(deletePostOrRepostInUserProfile({repostId: repostToRemove?._id}))
        }
      }
      else {
        const newRepost = await createRepostMutation({ postId, token }).unwrap()
        dispatch(addRepostInUserProfile(newRepost))
    } 
  }

  function openEditPostModal(): void {
    dispatch(setPostToEdit(post));
    setShowContextMenu(false);
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
    <div className="w-full h-auto p-3 border-b border-borderColor relative">
      {/* will only show if this component is a repost */}
      {repost && (
        <p className="text-[#ffffff5e] ml-5 text-xs mb-[.5rem] flex items-center gap-3">
          <FiRepeat /> {repost.repost_creator.username === authenticatedUser?.username ? "You" : repost.repost_creator.username} reposted
        </p>
      )}

      {/* context menu */}
      {showContextMenu && (
        <div className="bg-[#171717] absolute right-5 top-10 rounded-md h-auto z-10 w-[120px]">
          <p
            className="w-full text-white text-xs border-[#82818154] border-b p-3 text-left cursor-pointer"
            onClick={openEditPostModal}
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
          repost={toggleRepostHandler}
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
                width="3"
                height="100%"
                viewBox="0 0 3 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className="absolute top-0 left-0 "
              >
                <path
                  d="M1 1L1.01805 1000"
                  stroke="#B0A2A2"
                  strokeOpacity="0.73"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="stroke-[#ffffff39] stroke-2"
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
                  ? "relative pb-6"
                  : "flex items-center justify-center"
              }`}
            >
              {getUserImageUrls().map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt=""
                  className={`object-cover rounded-full 
                  ${bubbleStyleUserImageWhoReplied(index, getUserImageUrls())}
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
              <h2 className="text-white font-medium text-xs hover:underline underline-offset-2">
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
          <div className="w-full">
            <p className="text-xs text-[#ffffff] tracking-wide whitespace-pre-wrap break-words w-[250px] sm:w-full">
              {post.content}
            </p>
          </div>

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
              className={` text-[1.3rem] p-2 rounded-full hover:bg-[#4e4a4a48] ease-in-out duration-300 cursor-pointer ${
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

            {/* reply */}
            <p
              className="text-white text-[1.3rem] p-2 rounded-full hover:bg-[#4e4a4a48] ease-in-out duration-300 cursor-pointer"
              onClick={() => {
                setPostData(post);
                setShowPostPreviewModal(true);
              }}
            >
              <BsChat className="transition-transform transform-gpu ease-linear duration-100 active:scale-90" />
            </p>
            {/* repost */}
            <p
              className="text-white text-[1.3rem] p-2 rounded-full hover:bg-[#4e4a4a48] ease-in-out duration-300 cursor-pointer"
              onClick={() => toggleRepostHandler(post._id)}
            >
              {/*  */}
              {isReposted ? (
                <TbRepeatOff className="transition-transform transform-gpu ease-linear duration-100 active:scale-90" />
              ) : (
                <TbRepeat className="transition-transform transform-gpu ease-linear duration-100 active:scale-90" />
              )}
            </p>
          </div>
          {/* end of icons */}

          {/* reply and like count */}
          <p className="text-[#7b7575] text-xs flex items-center gap-1">
            {postReplies.length > 0 && (
              <Link to={`/${post.creator.username}/post/${post._id}`}>
                <span
                  // onClick={() => {
                  //   setPostData(post);
                  //   setShowPostPreviewModal(true);
                  // }}
                  className="cursor-pointer hover:underline underline-offset-2"
                >
                  {" "}
                  {postReplies.length}{" "}
                  {postReplies.length > 1 ? "replies" : "reply"}
                </span>
              </Link>
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
