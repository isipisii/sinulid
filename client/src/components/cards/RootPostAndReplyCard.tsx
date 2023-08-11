import { FC } from "react";
import { Post } from "../../types/types";
import { MemoizedThreadAndRepostCard } from "./ThreadAndRepostCard";
import { useAppSelector } from "../../features/app/hooks";
import { repostChecker } from "../../util/repostChecker";
import { filteredUserReposts } from "../../util/filteredUserReposts";

interface IRootPostAndReplyCard {
  post: Post;
  isRootPost: boolean
}

const RootPostAndReplyCard: FC<IRootPostAndReplyCard> = ({ post, isRootPost }) => {
  const { token, user: authenticatedUser } = useAppSelector((state) => state.auth);
  const { userPostsAndReposts } = useAppSelector((state) => state.userProfile);

  const userReposts = filteredUserReposts(userPostsAndReposts);
  const isParentReposted = repostChecker( userReposts, post?.parent?._id ?? "", authenticatedUser?._id ?? "");
  const isRootPostReposted = repostChecker( userReposts, post?._id ?? "", authenticatedUser?._id ?? "");

  return (  
    <div className="w-full flex-col flex items-center">
      {/* this is the parent of root post or reply */}
      {post?.parent && (
        <MemoizedThreadAndRepostCard
          post={post.parent}
          token={token}
          authenticatedUser={authenticatedUser}
          isReposted={isParentReposted}
          isParent={true}
          // this will only show in user replies in order to indentify if the parent has is replying to another post
          replyingTo={post?.parent?.parent?.creator ? post.parent.parent.creator.username  : null}
        />
      )}
      {/* this is the root post or root reply */}
      <div className={`w-full ${post.parent ? "mt-[-2.8rem]" : null}`}>
        <MemoizedThreadAndRepostCard
          post={post}
          token={token}
          authenticatedUser={authenticatedUser}
          isReposted={isRootPostReposted}
          isRootPost={isRootPost}
        />
      </div>
    </div>
  );
};

export default RootPostAndReplyCard;
