import { JSX, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../features/app/hooks";
import { useParams } from "react-router-dom";
import { useLazyGetSinglePostQuery, useLazyGetPostRepliesQuery, useDeletePostReplyMutation } from "../services/postApi";
import { setSinglePost } from "../features/post/postSlice";

import PostCard from "../components/PostCard";
import { Reply } from "../types/types";
import ReplyCard from "../components/ReplyCard";

const PostAndReplies = (): JSX.Element => {
  const { user: authenticatedUser, token } = useAppSelector(
    (state) => state.auth
  );
  const [postReplies, setPostReplies] = useState<Reply[]>([]);
  const { post } = useAppSelector((state) => state.post);
  const dispatch = useAppDispatch();
  const [getSinglePostQuery] = useLazyGetSinglePostQuery();
  const [getPostReplies] = useLazyGetPostRepliesQuery()
  const [deletePostReplyMutation] = useDeletePostReplyMutation();
  const { postId, username } = useParams();

  useEffect(() => {
    async function getSinglePostAndReplies() {
      if (!postId) return;

      try {
        const post = await getSinglePostQuery(postId).unwrap();
        if (post) {
          dispatch(setSinglePost(post));
        }
        const replies = await getPostReplies(post?._id).unwrap();
        if (replies) {
          setPostReplies(replies);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getSinglePostAndReplies();
  }, [postId, username]);
  console.log(post);
  console.log(postReplies)

  // const handleSubmitReply = useCallback(
  //   async (e: FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();
  //     if (!postData) return;
  //     try {
  //       const replyRes = await createPostReply({
  //         postId: postData?._id,
  //         token,
  //         content: reply,
  //       }).unwrap();
  //       const updatedReplies = [...postReplies, replyRes];
  //       setPostReplies(updatedReplies);
  //       setReply("");
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },
  //   [reply, postData, createPostReply, setPostReplies, token, postReplies]
  // );

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
    <section className="bg-matteBlack w-full flex items-center justify-center pb-[100px]">
      <div
        className={`max-w-[1400px] h-full  w-full ${
          authenticatedUser ? "md:ml-[120px] md:mr-[50px] lg:ml-[250px]" : null
        } flex justify-center`}
      >
        <main className="w-full pt-[90px] flex items-center flex-col justify-center sm:mx-[50px] max-w-[700px]">
          {post && (
            <PostCard
              post={post}
              token={token}
              authenticatedUser={authenticatedUser}
            />
          )}
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
        </main>
      </div>
    </section>
  );
};

export default PostAndReplies;
