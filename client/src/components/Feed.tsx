import { FC } from "react";
import PostCard from "./PostCard";
import { useAppSelector } from "../features/app/hooks";

const Feed: FC = () => {
  const { token, user } = useAppSelector((state) => state.auth);
  const { posts } = useAppSelector((state) => state.post);

  return (
    <div className="flex flex-col w-full">
      {posts.map((post, index) => (
        <PostCard
          key={index}
          post={post}
          token={token}
          authenticatedUser={user}
        />
      ))}
    </div>
  );
};

export default Feed;
