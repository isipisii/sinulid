import { FC } from "react";
import PostCard from "./PostCard";
import { useAppSelector } from "../features/app/hooks";
import { Repost } from "../types/types";

const Feed: FC = () => {
  const { token, user } = useAppSelector((state) => state.auth);
  const { userPostsAndReposts } = useAppSelector((state) => state.userProfile);
  const { posts } = useAppSelector((state) => state.post);

  // filtered reposts of the current user inorder to check if the post from feed is already reposted or not
  const userReposts = userPostsAndReposts.filter((item) => {
    if (item.type === "repost") {
      const repost = item as Repost;
      return repost;
    }
  }) as Repost[];

  return (
    <div className="flex flex-col w-full">
      {posts.map((post) => {
        const isReposted = userReposts.some(
          (repost) =>
            repost.post._id === post._id &&
            repost.repost_creator._id === user?._id
        );

        return (
          <PostCard
            key={post._id}
            post={post}
            token={token}
            authenticatedUser={user}
            isReposted={isReposted}
            userReposts={userReposts}
          />
        );
      })}
    </div>
  );
};

export default Feed;
