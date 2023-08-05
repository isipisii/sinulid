import { FC, FormEvent, useState, useCallback } from "react";
import { Post, Reply } from "../../types/types";
import { IoMdClose } from "react-icons/io";
import { BsHeart, BsChat, BsHeartFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { FiRepeat } from "react-icons/fi";
import {
  useCreatePostReplyMutation,
  useDeletePostReplyMutation,
} from "../../services/postApi";
import { useAppSelector } from "../../features/app/hooks";
import { useFormatTimeStamp } from "../../hooks/useFormatTimestamp";

import ReplyCard from "../ReplyCard";

interface IPostPreviewModal {
  postData: Post;
  closeModal: () => void;
  didLike: boolean;
  toggleLike: (postId: string, token: string) => void;
  repost: (postId: string, repostId?: string) => void;
  postReplies: Reply[];
  setPostReplies: (replies: Reply[]) => void;
}

const PostPreviewModal: FC<IPostPreviewModal> = ({ postData, closeModal, didLike, repost, toggleLike, postReplies, setPostReplies }) => {
  const { user: authenticatedUser, token } = useAppSelector(
    (state) => state.auth
  );
  const [deletePostReplyMutation] = useDeletePostReplyMutation();
  const [createPostReply] = useCreatePostReplyMutation();
  const [reply, setReply] = useState<string>("");
  const formattedTimeStamp  = useFormatTimeStamp(postData?.createdAt);

  const handleSubmitReply = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!postData) return;
      try {
        const replyRes = await createPostReply({
          postId: postData?._id,
          token,
          content: reply,
        }).unwrap();
        const updatedReplies = [...postReplies, replyRes];
        setPostReplies(updatedReplies);
        setReply("");
      } catch (error) {
        console.log(error);
      }
    },
    [reply, postData, createPostReply, setPostReplies, token, postReplies]
  );

  async function handleDeleteReply(replyId: string): Promise<void> {
    if (!authenticatedUser) return;

    try {
      await deletePostReplyMutation({ token, replyId });
      const updatedReplies = postReplies.filter(
        (reply) => reply._id !== replyId
      );
      setPostReplies(updatedReplies);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="bg-[#000000bd] backdrop-blur-sm fixed w-[100vw] h-[100vh] z-20 top-0 left-0 flex items-center justify-center">
      {/* close icon */}
      <p
        className="top-5 right-5 text-[#525151] text-[1.5rem] absolute p-3 font-thin rounded-full bg-[#252424ce] hover:bg-[#424141ba] cursor-pointer"
        onClick={closeModal}
      >
        <IoMdClose />
      </p>

      <div
        className={`${
          postData?.image ? "md:w-[80%]" : "md:w-[60%] max-w-[600px]"
        } h-[450px] flex items-stretch justify-center w-[95%] mt-[4rem] md:mt-0`}
      >
        {/* post image */}
        {postData?.image && (
          <div className="bg-black h-full flex items-center rounded-tl-md rounded-bl-md  border-borderColor border-y border-l">
            <img
              src={postData?.image?.url}
              alt=""
              className="w-full max-w-[500px] object-contain h-[400px]"
            />
          </div>
        )}
        {/* end of post image */}

        <div
          className={`bg-matteBlack h-full w-full ${
            postData?.image
              ? "max-w-[500px]  rounded-tr-md rounded-br-md"
              : "rounded-md border-l"
          } p-4 flex gap-4 flex-col border-borderColor border-y border-r`}
        >
          <div
            className={`flex justify-between gap-3 ${
              postReplies.length === 0
                ? "border-b border-borderColor pb-4"
                : null
            }`}
          >
            {/*post creator*/}
            {/* post creator image */}
            <img
              src={
                postData?.creator?.displayed_picture
                  ? postData.creator?.displayed_picture?.url
                  : "https://greenacresportsmed.com.au/wp-content/uploads/2018/01/dummy-image.jpg"
              }
              alt=""
              className="rounded-full w-[35px] h-[35px] object-cover"
            />

            <div className="w-full flex-col flex gap-2">
              <div className="flex justify-between items-center">
                <h2 className="text-white font-medium text-xs">
                  {postData?.creator.username}
                </h2>
                <p className="text-lightText text-xs">{formattedTimeStamp}</p>
              </div>
              {/* end of post creator*/}

              {/* post content */}
              <p className="text-xs text-[#ffffff] tracking-wide whitespace-pre-line">
                {postData?.content}
              </p>

              {/* icons */}
              <div className="flex items-center my-1 ml-[-.5rem]">
                {/* heart */}
                  <p
                    className={` text-[1.3rem] p-2 rounded-full hover:bg-[#4e4a4a48] ease-in-out duration-300 ${
                      didLike ? "text-red-500" : "text-white"
                    } `}
                    onClick={() => {
                      if (!postData) return;
                      toggleLike(postData?._id, token);
                    }}
                  >
                    {didLike ? <BsHeartFill /> : <BsHeart />}
                  </p>

                {/* reply */}
                  <p className="text-white text-[1.3rem] p-2 rounded-full hover:bg-[#4e4a4a48] ease-in-out duration-300">
                    <BsChat />
                  </p>

                {/* repost */}
                  <p
                    className="text-white text-[1.3rem] p-2 rounded-full hover:bg-[#4e4a4a48] ease-in-out duration-300"
                    onClick={() => {
                      if (!postData) return;
                      repost(postData?._id);
                    }}
                  >
                    <FiRepeat />
                  </p>
              </div>
              {/* end of icons */}
              
              {/* reply and like count */}
              <p className="text-[#7b7575] text-xs flex items-center gap-1">
                {postReplies.length > 0 && (
                  <span className="cursor-pointer hover:underline underline-offset-2">
                    {postReplies.length}{" "}
                    {postReplies.length > 1 ? "replies" : "reply"}
                  </span>
                )}
                {postReplies.length > 0 && postData.likes > 0 && <span>·</span>}
                {postData.likes > 0 && (
                  <span className="cursor-pointer hover:underline underline-offset-2">
                    {postData.likes} {postData.likes > 1 ? "likes" : "like"}
                  </span>
                )}
              </p>
              {/*end of reply and like count */}
              
            </div>
          </div>

          {/* post replies */}
          <div className="h-[100%] overflow-y-auto flex justify-center">
            {postReplies.length === 0 ? (
              <p className="text-lightText text-xs font-light">
                No replies yet
              </p>
            ) : (
              postReplies && (
                <div className="flex flex-col items-center w-full">
                  {postReplies.map((reply, index) => (
                    <ReplyCard
                      reply={reply}
                      key={index}
                      handleDeleteReply={handleDeleteReply}
                    />
                  ))}
                </div>
              )
            )}
          </div>
          {/* end of post replies */}

          {/* reply form */}
          <form
            onSubmit={handleSubmitReply}
            className="flex gap-3 items-center rounded-full"
          >
            <img
              src={
                authenticatedUser?.displayed_picture
                  ? authenticatedUser?.displayed_picture?.url
                  : "https://greenacresportsmed.com.au/wp-content/uploads/2018/01/dummy-image.jpg"
              }
              alt="user profile"
              className="h-[25px] w-[25px] rounded-full object-cover"
            />
            <textarea
              placeholder={`Reply to ${postData?.creator.username}`}
              onChange={(e) => setReply(e.target.value)}
              value={reply}
              rows={1}
              className="outline-none text-white p-2 text-xs w-full bg-transparent rounded-xl placeholder-[#4a4545] resize-none"
            />
            <button type="submit" className="text-[1.3rem] text-white ">
              <IoMdSend />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostPreviewModal;
