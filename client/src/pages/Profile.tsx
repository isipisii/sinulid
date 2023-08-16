import { JSX, useEffect } from "react";
import { Link, Outlet, useParams, useLocation } from "react-router-dom";
import {
  useLazyGetUserInfoQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useLazyGetUserPostsAndRepostsQuery,
} from "../services/authAndUserApi";
import { useAppDispatch, useAppSelector } from "../features/app/hooks";

import {
  setUserProfileInfo,
  unfollowUser,
  followUser,
  setUserPostsAndReposts,
  setOtherUserPostsAndReposts,
  unfollowRandomUser,
  unfollowSearchedUser,
  followRandomUser,
  followSearchedUser
} from "../features/user/userProfileSlice";

import EditUserProfileModal from "../components/modals/EditUserProfileModal";
import UserProfileInfo from "../components/UserProfileInfo";

import useDocumentTitle from "../hooks/useDocumentTitle";
import UserPostsAndReposts from "../components/UserPostsAndReposts";
import UserProfileInfoLoader from "../components/loader/UserProfileInfoLoader";

const Profile = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { username } = useParams();
  const location = useLocation();
  const { user: authenticatedUser, token } = useAppSelector(
    (state) => state.auth
  );
  const { userProfileInfo, toEditUserInfo } =
    useAppSelector((state) => state.userProfile);

  const [followMutation] = useFollowUserMutation();
  const [unfollowMutation] = useUnfollowUserMutation();

  const [getUserInfoQuery, { isLoading: isUserInfoLoading }] = useLazyGetUserInfoQuery();
  const [getPostsAndRepostsQuery, { isFetching: isFetchingPostsAndReposts }] = useLazyGetUserPostsAndRepostsQuery();
    
  useDocumentTitle(
    userProfileInfo
      ? `${userProfileInfo?.name} (${userProfileInfo?.username}) on Threads`
      : "Threads"
  );

  const isActive = (currentPath: string): boolean =>
    location.pathname === currentPath;

  const isFollowing = userProfileInfo?.followers.some(
    (follower) => follower._id === authenticatedUser?._id
  );

  function toggleFollowAndUnfollowHandler(): void {
    if (!authenticatedUser || !userProfileInfo) return;

    if (isFollowing) {
      dispatch(unfollowRandomUser({ userTofollowId: userProfileInfo._id , authenticatedUser}));
      dispatch(unfollowSearchedUser({ userTofollowId: userProfileInfo._id , authenticatedUser}));
      dispatch(unfollowUser(authenticatedUser));
      unfollowMutation({ token, userToFollowId: userProfileInfo._id });
    } else {
      dispatch(followRandomUser({ userTofollowId: userProfileInfo._id , authenticatedUser}));
      dispatch(followSearchedUser({ userTofollowId: userProfileInfo._id , authenticatedUser}));
      dispatch(followUser(authenticatedUser));
      followMutation({ token, userToFollowId: userProfileInfo._id });
    }
  }

  useEffect(() => {
    async function getUserInfoAndPostsAndReposts(): Promise<void> {
      if (!username) return;

      try {
        const user = await getUserInfoQuery(username).unwrap();
        if (user) {
          dispatch(setUserProfileInfo(user));
        }
        
        const userPostsAndRepostsPayload = await getPostsAndRepostsQuery(user._id).unwrap();
  
        if (userPostsAndRepostsPayload) {
          if (user._id === authenticatedUser?._id && authenticatedUser) {
            dispatch(setUserPostsAndReposts(userPostsAndRepostsPayload));
          } else {
            dispatch(setOtherUserPostsAndReposts(userPostsAndRepostsPayload));
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    getUserInfoAndPostsAndReposts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);


  return (
    <section className="bg-matteBlack w-full flex py-[90px] justify-center">
      <div
        className={`max-w-[1400px] h-full  w-full ${
          authenticatedUser ? "md:ml-[120px] md:mr-[50px] lg:ml-[250px]" : null
        } flex justify-center`}
      >
        {toEditUserInfo && <EditUserProfileModal />}
        <main className="w-full flex items-center flex-col gap-3 md-p-4 max-w-[600px]">
          {/* user infos */}
          {isUserInfoLoading ? (
            <UserProfileInfoLoader />
          ) : (
            <>
              <UserProfileInfo
                authenticatedUser={authenticatedUser}
                token={token}
                userProfileInfo={userProfileInfo}
                username={username ?? ""}
                toggleFollowAndUnfollowHandler={toggleFollowAndUnfollowHandler}
              />

              <div className="flex w-full ">
                <Link
                  to={`/profile/${username}`}
                  className={`w-full ${
                    isActive(`/profile/${userProfileInfo?.username}`)
                      ? " border-white text-white"
                      : "text-lightText border-borderColor"
                  } border-b text-center text-sm p-3 font-medium`}
                >
                  Threads
                </Link>
                <Link
                  to="replies"
                  className={`w-full ${
                    isActive(`/profile/${userProfileInfo?.username}/replies`)
                      ? "border-b border-white text-white"
                      : "text-lightText border-borderColor"
                  } border-b text-center text-sm p-3 font-medium`}
                >
                  Replies
                </Link>
              </div>
            </>
          )}
          {/* end of user infos */}

          {/* user posts  and reposts*/}
          <UserPostsAndReposts
            authenticatedUser={authenticatedUser}
            userProfileInfo={userProfileInfo}
            token={token}
            isActive={isActive}
            isFetchingPostsAndReposts={isFetchingPostsAndReposts}
          />
          
          {/* nested route */}
          {/* this is the where the user replies will render */}
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default Profile;
