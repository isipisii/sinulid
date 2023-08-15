import { FC, useEffect } from "react";
import { User } from "../../types/types";
import RootPostAndReplyCard from "../cards/RootPostAndReplyCard";
import { useLazyGetUserRepliesQuery } from "../../services/authAndUserApi";
import { useAppDispatch, useAppSelector } from "../../features/app/hooks";
import { setUserRepliesInProfilePage } from "../../features/post/postSlice";
import { RotatingLines } from "react-loader-spinner";

interface IUserReplies {
  userProfileInfo: User | null;
}

const UserReplies: FC<IUserReplies> = ({ userProfileInfo }) => {
  const [getUserRepliesQuery, { isLoading }] = useLazyGetUserRepliesQuery();
  const dispatch = useAppDispatch();
  const { userReplies } = useAppSelector((state) => state.post);
  const { user: authenticatedUser } = useAppSelector(state => state.auth)

  useEffect(() => {
    async function getUserReplies(): Promise<void> {
      if (!userProfileInfo) return;

      const replies = await getUserRepliesQuery(userProfileInfo._id).unwrap();
      if (replies) {
        dispatch(setUserRepliesInProfilePage(replies));
      }
    }
    getUserReplies();
  }, [dispatch, getUserRepliesQuery, userProfileInfo]);

  return (
    <div>
      {isLoading ? (
        <div className="h-[50vh] flex items-center justify-center">
          <RotatingLines
            strokeColor="grey"
            strokeWidth="4"
            animationDuration="0.75"
            width="25"
            visible={true}
          />
        </div>
      ) : 
      userReplies.length === 0 ? (
        <p className="text-lightText text-sm mt-4">{userProfileInfo?._id === authenticatedUser?._id ? "You haven't posted any replies yet." : "No replies yet."}</p>
      ) : (
        userReplies?.map((reply) => (
          <RootPostAndReplyCard
            post={reply}
            isRootPost={false}
            key={reply._id}
          />
        ))
      )}
    </div>
  );
};

export default UserReplies;
