import { FC, FormEvent, useState, useCallback } from "react";
import { Post, Reply } from "../../types/types";
import { IoMdClose } from "react-icons/io";
import { BsHeart, BsChat, BsHeartFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { FiRepeat } from "react-icons/fi";
import { useCreatePostReplyMutation, useDeletePostReplyMutation } from "../../services/postApi";
import { useAppSelector } from "../../features/app/hooks";
import { useFormatTimeStamp } from "../../hook/useFormatTimestamp";

import ReplyCard from "../ReplyCard";

interface IPostPreviewModal {
  postData: Post;
  closeModal: () => void;
  didLike: boolean;
  toggleLike: (postId: string, token: string) => void;
  repost: (postId: string, token: string) => Promise<void>;
  postReplies: Reply[];
  setPostReplies: (replies: Reply[]) => void
}

const PostPreviewModal: FC<IPostPreviewModal> = ({ postData, closeModal, didLike, repost, toggleLike, postReplies, setPostReplies }) => {
  const { user: authenticatedUser, token } = useAppSelector((state) => state.auth);
  const [deletePostReplyMutation] = useDeletePostReplyMutation()
  const [createPostReply] = useCreatePostReplyMutation();
  const [reply, setReply] = useState<string>("");
  const { formattedTimeStamp } = useFormatTimeStamp(postData?.createdAt);

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
        const updatedReplies = [...postReplies, replyRes]
        setPostReplies(updatedReplies)
        setReply("");
      } catch (error) {
        console.log(error);
      }
    },
    [reply, postData, createPostReply, setPostReplies, token, postReplies]
  );

  async function handleDeleteReply(replyId: string): Promise<void>{
    if(!authenticatedUser) return

    try {
        await deletePostReplyMutation({token, replyId})
        const updatedReplies = postReplies.filter(reply => reply._id !== replyId)
        setPostReplies(updatedReplies)
    } catch (error) {
        console.error(error)
    }
}

  return (
    <div className="bg-[#00000081] fixed w-[100vw] h-[100vh] z-10 top-0 left-0 flex items-center justify-center">
      {/* close icon */}
      <p
        className="top-2 right-2 text-white text-[1.3rem] absolute p-1 rounded-full bg-[#3d3d3dad] hover:bg-[#4f4c4c] cursor-pointer"
        onClick={closeModal}
      >
        <IoMdClose />
      </p>

      <div
        className={`${
          postData?.image ? "w-[80%]" : "w-[40%] max-w-[600px]"
        } h-[500px] flex items-stretch justify-center`}
      >
        {/* post image */}
        {postData?.image && (
          <div className="bg-black h-full flex items-center rounded-tl-3xl rounded-bl-3xl">
            <img
              src={postData?.image?.url}
              alt=""
              className="w-full max-w-[500px] object-contain h-[500px] rounded-tl-3xl rounded-bl-3xl"
            />
          </div>
        )}
        {/* end of post image */}

        {/*post creator*/}
        <div
          className={`bg-matteBlack h-full w-full ${
            postData?.image ? "max-w-[500px]" : null
          } p-4 ${
            postData?.image ? "rounded-tr-3xl rounded-br-3xl" : "rounded-3xl"
          } flex gap-4 flex-col`}
        >
          <div className="flex justify-between">
            <div className="flex gap-3 items-center">
              <img
                src={
                  postData?.creator?.displayed_picture
                    ? postData.creator?.displayed_picture?.url
                    : "https://greenacresportsmed.com.au/wp-content/uploads/2018/01/dummy-image.jpg"
                }
                alt=""
                className="rounded-full w-[35px] h-[35px]"
              />
              <h2 className="text-white font-medium text-sm">
                {postData?.creator.username}
              </h2>
            </div>
            <p className="text-lightText text-sm">{formattedTimeStamp}</p>
          </div>
          {/* end of post creator*/}

          {/* post content */}
          <p className="text-sm text-[#ffffff] tracking-wide whitespace-pre-line">
            {postData?.content}
          </p>

          {/* icons */}
          <div className="flex gap-3 items-center">
            {/* heart */}
            <div className="flex gap-1 items-center">
              <p
                className={` text-[1.1rem] p-2 rounded-full hover:bg-[#4e4a4a] ease-in-out duration-300 ${
                  didLike ? "text-red-500" : "text-white"
                } `}
                onClick={() => {
                  if (!postData) return;
                  toggleLike(postData?._id, token);
                }}
              >
                {didLike ? <BsHeartFill /> : <BsHeart />}
              </p>
              <p className="text-lightText text-sm">{postData?.likes}</p>
            </div>
            {/* replies */}
            <div className="flex gap-1 items-center">
              <p className="text-white text-[1.1rem] p-2 rounded-full hover:bg-[#4e4a4a] ease-in-out duration-300">
                <BsChat />
              </p>
              <p className="text-lightText text-sm">{postReplies.length}</p>
            </div>
            {/* repost */}
            <div className="flex gap-1 items-center">
              <p
                className="text-white text-[1.1rem] p-2 rounded-full hover:bg-[#4e4a4a] ease-in-out duration-300"
                onClick={() => {
                  if (!postData) return;
                  repost(postData?._id, token);
                }}
              >
                <FiRepeat />
              </p>
              <p className="text-lightText text-sm">0</p>
            </div>
          </div>
          {/* end of icons */}

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
                    <ReplyCard reply={reply} key={index} handleDeleteReply={handleDeleteReply}/>
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
              src={authenticatedUser?.displayed_picture?.url}
              alt="user profile"
              className="h-[25px] w-[25px] rounded-full"
            />
            <textarea
              placeholder={`Reply to ${postData?.creator.username}`}
              onChange={(e) => setReply(e.target.value)}
              value={reply}
              rows={1}
              className="outline-none text-white p-2 text-sm w-full bg-transparent rounded-xl placeholder-[#4a4545] resize-none"
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
