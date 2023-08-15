import { FC } from "react";
import { MemoizedThreadAndRepostCard } from "./cards/ThreadAndRepostCard";
import { useAppSelector } from "../features/app/hooks";
import { filteredUserReposts } from "../util/filteredUserReposts";
import { repostChecker } from "../util/repostChecker";

const Feed: FC = () => {
  const { token, user: authenticatedUser } = useAppSelector((state) => state.auth);
  const { userPostsAndReposts } = useAppSelector((state) => state.userProfile);
  const { posts } = useAppSelector((state) => state.post);
  const userReposts = filteredUserReposts(userPostsAndReposts);

  return (
    <div className="flex flex-col w-full">
      {posts.map((post) => {
        // Check if userReposts contains reposts and perform null checks
        const isReposted = repostChecker(userReposts, post._id, authenticatedUser?._id ?? "")
  
        return (
          <MemoizedThreadAndRepostCard
            key={post._id}
            post={post}
            token={token}
            authenticatedUser={authenticatedUser}
            isReposted={isReposted}
          />
        );
      })}
    </div>
  );
};

export default Feed;