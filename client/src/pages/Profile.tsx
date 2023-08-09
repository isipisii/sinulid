import { JSX, useEffect } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import {
  useLazyGetUserInfoQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useLazyGetUserPostsAndRepostsQuery,
} from "../services/authAndUserApi";
import { useAppDispatch, useAppSelector } from "../features/app/hooks";

import {
  setUserProfileInfo,
  setUserPostsAndReposts,
  setToEditUserInfo,
  unfollowUser,
  followUser,
} from "../features/user/userProfileSlice";
import { setImageUrl } from "../features/post/postSlice";

import { MemoizedPostAndRepostCard } from "../components/PostAndRepostCard";
import EditUserProfileModal from "../components/modals/EditUserProfileModal";
import { Repost, Post, ItemType } from "../types/types";
import { filteredUserReposts } from "../util/filteredUserReposts";

const Profile = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { username } = useParams();
  const { user: authenticatedUser, token } = useAppSelector(
    (state) => state.auth
  );
  const { userPostsAndReposts, userProfileInfo, toEditUserInfo } =
    useAppSelector((state) => state.userProfile);
  // helper function that filters the posts and reposts of the user and returns an array of user reposts
  const userReposts = filteredUserReposts(userPostsAndReposts)

  const [followMutation] = useFollowUserMutation();
  const [unfollowMutation] = useUnfollowUserMutation();

  const [getUserInfoQuery] = useLazyGetUserInfoQuery();
  const [getPostsAndRepostsQuery] = useLazyGetUserPostsAndRepostsQuery();

  function handleCopyLink(): void {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
  }

  const isFollowing = userProfileInfo?.followers.some(
    (follower) => follower._id === authenticatedUser?._id
  );

  function toggleFollowAndUnfollowHandler(): void {
    if (!authenticatedUser || !userProfileInfo) return;

    if (isFollowing) {
      dispatch(unfollowUser(authenticatedUser));
      unfollowMutation({ token, userToFollowId: userProfileInfo._id });
    } else {
      dispatch(followUser(authenticatedUser));
      followMutation({ token, userToFollowId: userProfileInfo._id });
    }
  }

  useEffect(() => {
    async function getUserInfo(): Promise<void> {
      if (!username) return;

      try {
        const user = await getUserInfoQuery(username).unwrap();
        if (user) {
          dispatch(setUserProfileInfo(user));
        }
      } catch (error) {
        console.error(error);
      }
    }
    getUserInfo();
  }, [username, dispatch, getUserInfoQuery]);

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
  }, [userProfileInfo?._id, dispatch, getPostsAndRepostsQuery, userProfileInfo]);

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
          <div className="w-full flex flex-col gap-4 p-4 md:p-0">
            {/* username and dp */}
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col">
                <h1 className="text-white text-[1.5rem] font-semibold">
                  {userProfileInfo?.name}
                </h1>
                <p className="text-white text-sm">
                  {userProfileInfo?.username}
                </p>
              </div>
              <img
                src={
                  userProfileInfo?.displayed_picture
                    ? userProfileInfo?.displayed_picture?.url
                    : "https://greenacresportsmed.com.au/wp-content/uploads/2018/01/dummy-image.jpg"
                }
                alt="profile picture"
                className="h-[80px] w-[80px] rounded-full object-cover cursor-pointer"
                onClick={() =>
                  userProfileInfo?.displayed_picture &&
                  dispatch(setImageUrl(userProfileInfo?.displayed_picture?.url))
                }
              />
            </div>
            {/*end of username and dp */}
            <div className="flex flex-col gap-4">
              {/* bio */}
              <p className="text-white text-xs max-w-[300px]">
                {userProfileInfo?.bio}
              </p>
              <p className="text-[#959494c9] text-xs">
                <span>
                  {userProfileInfo?.followerCount}{" "}
                  {userProfileInfo?.followerCount &&
                  userProfileInfo?.followerCount > 1
                    ? "followers"
                    : "follower"}{" "}
                </span>{" "} {userProfileInfo?.link && <span>·</span>} {" "}
                {userProfileInfo?.link && <a href={userProfileInfo?.link}>{userProfileInfo?.link}</a>}
              </p>
              {authenticatedUser && token && (
                <div className="flex gap-4">
                  {username === authenticatedUser?.username ? (
                    <button
                      className="text-white text-xs px-6 border hover:bg-[#2322225e] border-[#8d8c8c] py-2 rounded-md w-full"
                      onClick={() =>
                        dispatch(setToEditUserInfo(userProfileInfo))
                      }
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      className={`${
                        isFollowing
                          ? "border border-[#8d8c8c] hover:bg-[#2322225e] text-white"
                          : "bg-white text-black font-semibold"
                      } text-xs px-6 border py-2 rounded-md w-full`}
                      onClick={toggleFollowAndUnfollowHandler}
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </button>
                  )}
                  <button
                    className="text-white hover:bg-[#2322225e] text-xs px-6 border border-[#8d8c8c] py-2 rounded-md w-full"
                    onClick={handleCopyLink}
                  >
                    Share Profile
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* end of user infos */}

          <div className="flex w-full ">
            <Link
              to={`/profile/${username}`}
              className="w-full text-white border-white border-b text-center text-xs p-3 font-semibold"
            >
              Threads
            </Link>
            <Link
              to="replies"
              className="w-full text-[#ffffff7c] border-[#ffffff46] border-b text-center text-xs p-3 font-semibold"
            >
              Replies
            </Link>
          </div>

          {/* user posts */}
          <div className="flex flex-col w-full">
            {userPostsAndReposts &&
              userPostsAndReposts.map((item) => {
                // Check the type of the item and render the appropriate component
                // post
                if (item.type === ItemType.Post) {
                  const post = item as Post;
                  const isReposted = userReposts.some(
                  (repost) =>
                      repost.post._id === post._id &&
                      repost.repost_creator._id === authenticatedUser?._id
                  );

                  return (
                    <MemoizedPostAndRepostCard
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
                  const isReposted = userReposts.some(
                    (repost) =>
                      repost.post._id === repostItem.post._id &&
                      repost.repost_creator._id === authenticatedUser?._id
                  );
                  return (
                    <MemoizedPostAndRepostCard
                      key={repostItem._id}
                      repost={repostItem}
                      type="repost"
                      post={repostItem.post}
                      token={token}
                      authenticatedUser={authenticatedUser}
                      isReposted={isReposted}
                    />
                  );
                }
              })}
          </div>
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default Profile;
