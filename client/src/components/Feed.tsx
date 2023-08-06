import { FC } from "react";
import { MemoizedPostAndRepostCard } from "./PostAndRepostCard";
import { useAppSelector } from "../features/app/hooks";
import { filteredUserReposts} from "../util/filteredUserReposts";

const Feed: FC = () => {
  const { token, user: authenticatedUser } = useAppSelector((state) => state.auth);
  const { userPostsAndReposts } = useAppSelector((state) => state.userProfile);
  const { posts } = useAppSelector((state) => state.post);
  // helper function that filters the posts and reposts of the user and returns an array of user reposts
  const userReposts = filteredUserReposts(userPostsAndReposts)

  return (
    <div className="flex flex-col w-full">
      {posts.map((post) => {
        // will check every post to identify if it is being reposted by the current user
        const isReposted = userReposts.some((repost) => repost.post._id === post._id && repost.repost_creator._id === authenticatedUser?._id);

        return (
          <MemoizedPostAndRepostCard
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
