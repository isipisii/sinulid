import { JSX, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../features/app/hooks";
import { useParams, useNavigate } from "react-router-dom";
import {
  useLazyGetSinglePostQuery,
  useLazyGetRepliesQuery,
} from "../services/postApi";
import { setSinglePost, setReplies } from "../features/post/postSlice";
import { filteredUserReposts } from "../util/filteredUserReposts";
import { repostChecker } from "../util/repostChecker";

import { IoIosArrowBack } from "react-icons/io";
import { MemoizedThreadAndRepostCard } from "../components/cards/ThreadAndRepostCard";
import RootPostAndReplyCard from "../components/cards/RootPostAndReplyCard";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { RotatingLines } from "react-loader-spinner";
import ThreadCardLoader from "../components/loader/ThreadCardLoader";

const PostAndReplies = (): JSX.Element => {
  const { postId, username } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user: authenticatedUser, token } = useAppSelector((state) => state.auth);
  const { userPostsAndReposts } = useAppSelector((state) => state.userProfile);
  const { post, replies } = useAppSelector((state) => state.post);

  const [getSinglePostQuery, { isFetching: isGetSinglePostLoading }] = useLazyGetSinglePostQuery();
  const [getReplies, { isFetching: isGetRepliesLoading }] = useLazyGetRepliesQuery();
  const userReposts = filteredUserReposts(userPostsAndReposts);
  useDocumentTitle(post ? `${post.creator.username} · ${post.content} · Threads` : "Threads");

  useEffect(() => {
    async function getSinglePostAndReplies() {
      if (!postId) return;

      try {
        const post = await getSinglePostQuery(postId).unwrap();
        if (post) {
          dispatch(setSinglePost(post));
        }
        const replies = await getReplies(post._id).unwrap();
        dispatch(setReplies(replies));
      } catch (error) {
        console.error(error);
      }
    }
    getSinglePostAndReplies();
  }, [postId, username, dispatch, getSinglePostQuery, getReplies]);

  return (
    <section className="bg-matteBlack w-full flex items-center justify-center pb-[100px]">
      <div
        className={`max-w-[1400px] h-full  w-full ${
          authenticatedUser ? "md:ml-[120px] md:mr-[50px] lg:ml-[250px]" : null
        } flex justify-center`}
      >
        <main className="w-full pt-[90px] flex items-center flex-col justify-center sm:mx-[50px] max-w-[600px]">
          <div className="w-full relative mb-4">
            {authenticatedUser && (
              <p
                onClick={() => navigate(-1)}
                className=" cursor-pointer hover:bg-[#4e4a4a48] ease-in-out duration-300 p-2 rounded-md text-white absolute  my-auto left-2 md:left-0 text-sm flex items-center gap-1"
              >
                <IoIosArrowBack /> Back
              </p>
            )}
            <h1 className="text-white font-medium text-center text-[2rem]">
              Thread
            </h1>
          </div>

          {!post || isGetSinglePostLoading ? (
            <ThreadCardLoader index={2}/>
          ) : (
            <RootPostAndReplyCard post={post} isRootPost={true} />
          )}

          {!post || isGetSinglePostLoading || isGetRepliesLoading ? (
            <div className="h-[50vh] flex items-center justify-center">
              <RotatingLines
                strokeColor="grey"
                strokeWidth="4"
                animationDuration="0.75"
                width="25"
                visible={true}
              />
            </div>
          ) : replies.length === 0 ? (
            <p className="text-lightText text-sm mt-4">No replies yet.</p>
          ) : (
            <div className="flex flex-col items-center w-full">
              {replies.map((reply) => {
                const isReposted = repostChecker(
                  userReposts,
                  reply._id,
                  authenticatedUser?._id ?? ""
                );

                return (
                  <MemoizedThreadAndRepostCard
                    key={reply._id}
                    post={reply}
                    token={token}
                    authenticatedUser={authenticatedUser}
                    isReposted={isReposted}
                  />
                );
              })}
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

export default PostAndReplies;
