import { FC, useEffect } from "react";
import { Post, Repost, User, ItemType } from "../types/types";
import { repostChecker } from "../util/repostChecker";
import { MemoizedThreadAndRepostCard } from "./cards/ThreadAndRepostCard";
import { filteredUserReposts } from "../util/filteredUserReposts";
import { RotatingLines } from "react-loader-spinner";
import { useLazyGetUserPostsAndRepostsQuery } from "../services/authAndUserApi";
import { useAppSelector, useAppDispatch } from "../features/app/hooks";
import { setUserPostsAndReposts } from "../features/user/userProfileSlice";

interface IUserPostsAndReposts {
  isActive: (currPath: string) => boolean;
  userProfileInfo: User | null;
  authenticatedUser: User | null;
  token: string;
}

const UserPostsAndReposts: FC<IUserPostsAndReposts> = ({
  isActive,
  userProfileInfo,
  authenticatedUser,
  token,
}) => {
  const { userPostsAndReposts } = useAppSelector((state) => state.userProfile);
  const dispatch = useAppDispatch();
  const [getPostsAndRepostsQuery, { isFetching: isFetchingPostsAndReposts }] =
    useLazyGetUserPostsAndRepostsQuery();
  // helper function that filters the posts and reposts of the user and returns an array of user reposts
  const userReposts = filteredUserReposts(userPostsAndReposts);

  useEffect(() => {
    async function getUserRepostsAndPosts(): Promise<void> {
      if (!userProfileInfo) return;

      try {
        const userPostsAndRepostsPayload = await getPostsAndRepostsQuery(
          userProfileInfo?._id
        ).unwrap();
        if (userPostsAndRepostsPayload) {
          dispatch(setUserPostsAndReposts(userPostsAndRepostsPayload));
        }
      } catch (error) {
        console.error(error);
      }
    }
    getUserRepostsAndPosts();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfileInfo?._id]);

  return (
    <>
      {isActive(`/profile/${userProfileInfo?.username}`) && (
        <>
          {isFetchingPostsAndReposts || !userPostsAndReposts ? (
            <div className="h-[50vh] flex items-center justify-center">
              <RotatingLines
                strokeColor="grey"
                strokeWidth="5"
                animationDuration="0.75"
                width="25"
                visible={true}
              />
            </div>
          ) : userPostsAndReposts.length === 0 ? (
            <p className="text-lightText text-sm mt-4">{userProfileInfo?._id === authenticatedUser?._id ? "You haven't posted any replies yet." : "No replies yet."}</p>
          ) : (
            <div className="flex flex-col w-full">
              {userPostsAndReposts &&
                userPostsAndReposts.map((item) => {
                  // Check the type of the item and render the appropriate component
                  // post
                  if (item.type === ItemType.Post) {
                    const post = item as Post;
                    const isReposted = repostChecker(
                      userReposts,
                      post._id,
                      authenticatedUser?._id ?? ""
                    );

                    return (
                      <MemoizedThreadAndRepostCard
                        key={post._id}
                        post={post}
                        token={token}
                        authenticatedUser={authenticatedUser}
                        isReposted={isReposted}
                      />
                    );
                  }

                  // repost
                  if (item.type === ItemType.Repost) {
                    const repostItem = item as Repost;
                    const isReposted = repostChecker(
                      userReposts,
                      repostItem.post._id,
                      authenticatedUser?._id ?? ""
                    );

                    return (
                      <MemoizedThreadAndRepostCard
                        key={repostItem._id}
                        repost={repostItem}
                        type="repost"
                        post={repostItem.post}
                        token={token}
                        authenticatedUser={authenticatedUser}
                        isReposted={isReposted}
                        replyingTo={
                          repostItem.post.parent?.creator
                            ? repostItem.post.parent.creator.username
                            : null
                        }
                      />
                    );
                  }
                })}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default UserPostsAndReposts;
