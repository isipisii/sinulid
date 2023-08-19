import { FC, useEffect, useState, memo, useRef } from "react";
import { BsHeart, BsChat, BsHeartFill } from "react-icons/bs";
import { FiRepeat, FiSend } from "react-icons/fi";
import { TbRepeat, TbRepeatOff } from "react-icons/tb";
import { BsThreeDots } from "react-icons/bs";
import { Post, Repost, User } from "../../types/types";
import {
  useUnlikePostMutation,
  useLikePostMutation,
  useDeletePostMutation,
} from "../../services/postApi";
import {
  likePost,
  unlikePost,
  deletePost,
  setImageUrl,
  setPostToEdit,
  likePostInPostAndReplyPage,
  unlikePostInPostAndReplyPage,
  likePostReply,
  unlikePostReply,
  deletePostReply,
  likeParentOfRootPostInPostAndRepliesPage,
  unlikeParentOfRootPostInPostAndRepliesPage,
  likeParentOfRootPostReplyInUserReplies,
  unlikeParentOfRootPostReplyInUserReplies,
  likeUserReplyInUserReplies,
  unlikeUserReplyInUserReplies,
  deleteUserReplyInUserReplies
} from "../../features/post/postSlice";
import {
  likePostOrRepostInUserProfile,
  unlikePostOrRepostInUserProfile,
  deletePostOrRepostInUserProfile,
  addRepostInUserProfile,
} from "../../features/user/userProfileSlice";

import {
  useCreateRepostMutation,
  useRemoveRepostMutation,
} from "../../services/repostApi";

import { useAppDispatch, useAppSelector } from "../../features/app/hooks";
import { useFormatTimeStamp } from "../../hooks/useFormatTimestamp";
import { bubbleStyleUserImageWhoReplied } from "../../util/bubbleStyle";
import { filteredUserReposts } from "../../util/filteredUserReposts";

import { Link, useNavigate } from "react-router-dom";
import Spinner from "../loader/Spinner";
import { showToast } from "../../util/showToast";
import { Toaster } from "react-hot-toast";

interface IPostAndRepostCard {
  post: Post;
  token: string;
  authenticatedUser: User | null;
  repost?: Repost;
  type?: string;
  isReposted?: boolean;
  isRootPost?: boolean;
  isParent?: boolean;
  replyingTo?: string | null
}

const ThreadAndRepostCard: FC<IPostAndRepostCard> = ({
  post,
  token,
  authenticatedUser,
  repost,
  isReposted,
  isRootPost,
  isParent,
  replyingTo
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [likePostMutation] = useLikePostMutation();
  const [unlikePostMutation] = useUnlikePostMutation();
  const [deletePostMutation, { isLoading: isDeleting }] = useDeletePostMutation();
  const [createRepostMutation] = useCreateRepostMutation();
  const [removeRepostMutation] = useRemoveRepostMutation();

  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const formattedTimeStamp = useFormatTimeStamp(post.createdAt);
  const { userPostsAndReposts, userDefaultProfileImage } = useAppSelector((state) => state.userProfile);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);

  // helper function that filters the posts and reposts of the user and returns an array of user reposts
  const userReposts = filteredUserReposts(userPostsAndReposts);

  const didLike: boolean = post.liked_by.some(
    (user) => user._id === authenticatedUser?._id
  );

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideContextMenu, false);
    // cleanup function whenever the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutsideContextMenu, false);
    };
  }, []);

  // to hide the context menu when the user clicks outside the element or other element
  function handleClickOutsideContextMenu(e: MouseEvent): void {
    if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node) ) {
      setShowContextMenu(false);
    }
  }

  function toggleContextMenu(e: React.MouseEvent<HTMLDivElement>): void {
    e.stopPropagation();
    setShowContextMenu((prevState) => !prevState);
  }

  function toggleLikeHandler(postId: string, token: string): void {
    if (!authenticatedUser) {
      return;
    }
    if (didLike) {
      dispatch(unlikePostOrRepostInUserProfile({ postId, user: authenticatedUser })); // for user's profile optimistic update
      dispatch(unlikePostInPostAndReplyPage({ postId, user: authenticatedUser })); // for the root post in post and reply page
      dispatch(unlikePost({ postId, user: authenticatedUser })); // for feed's optimistic update
      dispatch(unlikePostReply({ postId, user: authenticatedUser })); // for post and reply page
      dispatch(unlikeParentOfRootPostInPostAndRepliesPage({ postId, user: authenticatedUser }))
      dispatch(unlikeParentOfRootPostReplyInUserReplies({ postId, user: authenticatedUser }))
      dispatch(unlikeUserReplyInUserReplies({ postId, user: authenticatedUser }))
      unlikePostMutation({ postId, token });
    } else {
      dispatch(likePostOrRepostInUserProfile({ postId, user: authenticatedUser })); // for user's profile optimistic update
      dispatch(likePostInPostAndReplyPage({ postId, user: authenticatedUser })); // for the root post in post and reply page
      dispatch(likePost({ postId, user: authenticatedUser })); // for feed's optimistic update
      dispatch(likePostReply({ postId, user: authenticatedUser })); // for post and reply page
      dispatch(likeParentOfRootPostInPostAndRepliesPage({ postId, user: authenticatedUser }))
      dispatch(likeParentOfRootPostReplyInUserReplies({ postId, user: authenticatedUser }))
      dispatch(likeUserReplyInUserReplies({ postId, user: authenticatedUser }))
      likePostMutation({ postId, token });
    }
  }

  async function deletePostHandler(
    postId: string,
    token: string
  ): Promise<void> {
    if (!authenticatedUser) return;

    try {
      // delete the original post
      await deletePostMutation({ postId, token });
      dispatch(
        deletePostOrRepostInUserProfile({ postId, repostId: repost?._id })
      ); // for user's profile optimistic update
      dispatch(deletePost(postId)); // for feed's optimistic update
      dispatch(deletePostReply(postId));
      dispatch(deleteUserReplyInUserReplies(postId))
      setShowContextMenu(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function toggleRepostHandler(postId: string): Promise<void> {
    if (!authenticatedUser) return;
    // if a post card is marked as reposted, then it will remove the repost
    if (isReposted) {
      // retrieving the repost that will be remove by checking if this card is being reposted by the user
      const repostToRemove = userReposts?.find(
        (repost) => repost.post._id === post._id
      );

      if (repostToRemove) {
        await removeRepostMutation({ token, repostId: repostToRemove?._id });
        dispatch(
          deletePostOrRepostInUserProfile({ repostId: repostToRemove?._id })
        );
      }
    } else {
      try {
        const newRepost = await createRepostMutation({
          postId,
          token,
        }).unwrap();
        
        showToast("Reposted");
        dispatch(addRepostInUserProfile(newRepost));

      } catch (error) {
        console.error;
      }
    }
  }

  // gets the users' image unique url who replied on a certain post
  function getUserImageUrls(post: Post) {
    const imageUrls: string[] = [];
    const maxImages = 3
  
    for (const reply of post.children) {
      const imageUrl = reply.creator?.displayed_picture?.url ?? userDefaultProfileImage;
      if (imageUrl) {
        if (!imageUrls.includes(imageUrl)) {
          imageUrls.push(imageUrl);
        }
  
        if (imageUrls.length === maxImages) {
          break;
        }
      }
    }
  
    return imageUrls;
  }
  

  function openEditPostModal(): void {
    dispatch(setPostToEdit(post));
    setShowContextMenu(false);
  }

  // will copy to clipboard the post's link
  function copyPostLink(username: string, postId: string): void {
    const origin = window.location.origin;
    const postLink = `${origin}/${username}/post/${postId}`;

    navigator.clipboard.writeText(postLink);
    showToast("Post link was copied to clipboard");
  }

  // the will only show if the post has a reply a children and this component is not a root post in post and reply page
  function shouldRender(): boolean {
    return post?.children.length > 0 && !isRootPost;
  }

  return (
    <div
      className={`w-full h-auto p-3 relative ${
        isParent ? null : "border-b border-borderColor"
      }`}
    >
      {/* toast notification */}
      <Toaster position="bottom-center" reverseOrder={false} />
      {/* will only show if this component is a repost */}
      {repost && (
        <p className="text-[#ffffff5e] ml-5 text-sm mb-[.5rem] flex items-center gap-3">
          <FiRepeat />{" "}
          {repost.repost_creator._id === authenticatedUser?._id
            ? "You"
            : repost.repost_creator.username}{" "}
          reposted
        </p>
      )}

      {/* context menu */}
      {showContextMenu && (
        <div
          ref={contextMenuRef}
          className="bg-matteBlack absolute right-5 top-10 rounded-md h-auto z-10 w-[130px] border border-borderColor p-2 flex flex-col gap-1"
        >
          <button
            className="w-full text-white text-xs p-3 text-left cursor-pointer hover:bg-[#3a383830] rounded-sm ease-in-out duration-300"
            onClick={openEditPostModal}
          >
            Edit
          </button>
          <button
            className={`w-full text-red-600 text-xs p-3 text-left cursor-pointer rounded-sm hover:bg-[#3a383830] ease-in-out duration-300 flex gap-2 items-center`}
            onClick={() => deletePostHandler(post._id, token)}
            disabled={isDeleting ? true : false}
          >
            {isDeleting && (
              <Spinner fillColor="fill-red-600" pathColor="text-gray-400" />
            )}
            {isDeleting ? "Deleting" : "Delete"}
          </button>
        </div>
      )}
      {/* end of context menu */}

      {/* post infos */}
      <div className="flex gap-2 h-auto w-full">
        <div className="items-center flex flex-col gap-3">
          {!isRootPost && (
            <div className=" w-[35px] h-[35px]">
              <img
                src={
                  post.creator?.displayed_picture
                    ? post.creator?.displayed_picture?.url
                    : userDefaultProfileImage
                }
                alt="profile picture"
                className="rounded-full w-[35px] h-[35px] object-cover"
              />
            </div>
          )}

          {/* line */}
          {/* will only show when there's a reply */}
          {shouldRender() &&
            (isParent ? (
              <div className="h-full flex items-center flex-col">
                <div className="h-full relative">
                  <svg
                    width="3"
                    height="100%"
                    viewBox="0 0 3 500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                    className="absolute top-0 left-0"
                  >
                    <path
                      d="M1 1L1 1000"
                      stroke="#29292e"
                      strokeOpacity="0.73"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="stroke-[#33333a] stroke-2"
                    />
                  </svg>
                </div>
                <img src="/assets/loop.svg" alt="loop" className="mr-[.86rem]" />
              </div>
            ) : (
              <div className="h-full relative">
                <svg
                  width="3"
                  height="100%"
                  viewBox="0 0 3 500"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  className="absolute top-0 left-0"
                >
                  <path
                    d="M1 1L1 1000"
                    stroke="#29292e"
                    strokeOpacity="0.73"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="stroke-[#33333a] stroke-2"
                  />
                </svg>
              </div>
            ))}
          {/* end of line */}

          {/* users who replied */}
          {shouldRender() && (
            <div
              className={`h-[30px] w-[39px] ${
                getUserImageUrls(post).length >= 2
                  ? "relative pb-6"
                  : "flex items-center justify-center"
              }`}
            >
              {getUserImageUrls(post).map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt=""
                  className={`object-cover rounded-full 
                  ${bubbleStyleUserImageWhoReplied(index, getUserImageUrls(post))}`}
                />
              ))}
            </div>
          )}
          {/*end of users who replied */}
        </div>

        <div
          className={`w-full flex-col flex gap-1 ${
            isParent ? "mb-[4rem]" : null
          }`}
          >
          {/* post creator and other details */}
          <div
            className={`flex items-center w-[100%] justify-between ${
              isRootPost ? "mb-1" : "mb-0"
            }`}
          >
            <Link
              to={`/profile/${post.creator.username}`}
              className={`flex items-center gap-3 ${isRootPost ? "ml-[-.3rem]" : null}`}
            >
              {isRootPost && (
                <div className="w-[35px] h-[35px]">
                  <img
                    src={
                      post.creator?.displayed_picture
                        ? post.creator?.displayed_picture?.url
                        : userDefaultProfileImage
                    }
                    alt="profile picture"
                    className="rounded-full w-[35px] h-[35px] object-cover"
                  />
                </div>
              )}
              <h2 className="text-white font-medium text-sm hover:underline underline-offset-2">
                {post.creator.username}
              </h2>
            </Link>
            <div className="flex items-center gap-1">
              <p className="text-sm text-lightText">{formattedTimeStamp}</p>
              {authenticatedUser?._id === post.creator._id && !isRootPost && !isParent && (
                <p
                  className="cursor-pointer text-base text-white rounded-full hover:bg-[#4e4a4a48] ease-in-out duration-300 p-1"
                  onClick={toggleContextMenu}
                >
                  <BsThreeDots className="transition-transform transform-gpu ease-linear duration-100 active:scale-90" />
                </p>
              )}
            </div>
          </div>
          {/*end of post creator and other details */}

          {/* post content */}
          <div className="w-full">
            <Link to={`/${post.creator.username}/post/${post._id}`}>
              {/* will pop out when the parent post or the reposted post has a parent post  */}
              {replyingTo &&
              <div className="mb-2">
                <p className="text-sm text-lightText">Replying to @{replyingTo}</p>
              </div>}

              <p className="text-sm text-[#ffffff] tracking-wide whitespace-pre-wrap break-words w-[250px] sm:w-[490px]">
                {post.content}
              </p>
            </Link>
          </div>

          {post?.image && (
            <img
              src={post?.image?.url}
              alt="post image"
              className=" w-full mt-1 border border-borderColor rounded-md cursor-pointer object-cover max-w-[500px] transition-transform transform-gpu ease-linear duration-100 active:scale-[.98]"
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
              className={` text-[1.1rem] p-2 rounded-full hover:bg-[#4e4a4a48] ease-in-out duration-300 cursor-pointer ${
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
              className="text-white text-[1.1rem] p-2 rounded-full hover:bg-[#4e4a4a48] ease-in-out duration-300 cursor-pointer"
              onClick={() => {
                navigate(`/create-reply/${post._id}`);
              }}
            >
              <BsChat className="transition-transform transform-gpu ease-linear duration-100 active:scale-90" />
            </p>
            {/* repost */}
            <p
              className="text-white text-[1.1rem] p-2 rounded-full hover:bg-[#4e4a4a48] ease-in-out duration-300 cursor-pointer"
              onClick={() => toggleRepostHandler(post._id)}
            >
              {isReposted ? (
                <TbRepeatOff className="transition-transform transform-gpu ease-linear duration-100 active:scale-90" />
              ) : (
                <TbRepeat className="transition-transform transform-gpu ease-linear duration-100 active:scale-90" />
              )}
            </p>

            {/* share */}
            <p
              className="text-white text-[1.1rem] p-2 rounded-full hover:bg-[#4e4a4a48] ease-in-out duration-300 cursor-pointer"
              onClick={() => copyPostLink(post.creator.username, post._id)}
            >
              <FiSend className="transition-transform transform-gpu ease-linear duration-100 active:scale-90" />
            </p>
          </div>
          {/* end of icons */}
          
          {/* reply and like count */}
          <p className="text-[#7b7575] text-sm flex items-center gap-1">
            {/* post.children is an array of replies in a certain post */}
            {post.children.length > 0 && (
              <Link to={`/${post.creator.username}/post/${post._id}`}>
                <span className="cursor-pointer hover:underline underline-offset-2">
                  {" "}
                  {post.children.length}{" "}
                  {post.children.length > 1 ? "replies" : "reply"}
                </span>
              </Link>
            )}
            {post.children.length > 0 && post.likes > 0 && <span>·</span>}
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

export const MemoizedThreadAndRepostCard = memo(ThreadAndRepostCard);
