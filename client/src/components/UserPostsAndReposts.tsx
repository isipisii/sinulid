import { FC } from "react";
import { Post, Repost, User, ItemType } from "../types/types";
import { repostChecker } from "../util/repostChecker";
import { MemoizedThreadAndRepostCard } from "./cards/ThreadAndRepostCard";
import { filteredUserReposts } from "../util/filteredUserReposts";
import { RotatingLines } from "react-loader-spinner";
import { useAppSelector } from "../features/app/hooks";

interface IUserPostsAndReposts {
  isActive: (currPath: string) => boolean;
  userProfileInfo: User | null;
  authenticatedUser: User | null;
  token: string;
  isFetchingPostsAndReposts: boolean
}

const UserPostsAndReposts: FC<IUserPostsAndReposts> = ({
  isActive,
  userProfileInfo,
  authenticatedUser,
  token,
  isFetchingPostsAndReposts
}) => {
  const { userPostsAndReposts, otherUserPostsAndReposts } = useAppSelector((state) => state.userProfile);
  // helper function that filters the posts and reposts of the user and returns an array of user reposts
  const userReposts = filteredUserReposts(userPostsAndReposts);

  return (
    <>
      {isActive(`/profile/${userProfileInfo?.username}`) && (
        <>
          {isFetchingPostsAndReposts || !userPostsAndReposts ? (
            <div className="h-[50vh] flex items-center justify-center">
              <RotatingLines
                strokeColor="grey"
                strokeWidth="4"
                animationDuration="0.75"
                width="25"
                visible={true}
              />
            </div>
          ) : (userProfileInfo?._id === authenticatedUser?._id ? userPostsAndReposts : otherUserPostsAndReposts).length === 0 ? (
            <p className="text-lightText text-sm mt-4">{userProfileInfo?._id === authenticatedUser?._id ? "You haven't posted any threads yet." : "No threads yet."}</p>
          ) : (
            <div className="flex flex-col w-full">
              { 
              // will map the current user posts and reposts if it is in its own profile
                (userProfileInfo?._id === authenticatedUser?._id ? userPostsAndReposts : otherUserPostsAndReposts).map((item) => {
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
