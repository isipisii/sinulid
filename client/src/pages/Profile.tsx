import { JSX, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLazyGetUserInfoQuery, useFollowUserMutation, useUnfollowUserMutation } from "../services/authAndUserApi";
import { useLazyGetUserPostsQuery } from "../services/postApi";
import { useAppDispatch, useAppSelector } from "../features/app/hooks";

import { setUserProfileInfo, setUserPosts, setToEditUserInfo, unfollowUser, followUser} from "../features/user/userProfileSlice";
import { setImageUrl } from "../features/post/postSlice";

import PostCard from "../components/PostCard";
import EditUserProfileModal from "../components/modals/EditUserProfileModal";

const Profile = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { username } = useParams();
  const { user: authenticatedUser, token } = useAppSelector((state) => state.auth);
  const { userPosts, userProfileInfo, toEditUserInfo } = useAppSelector((state) => state.userProfile);

  const [followMutation] = useFollowUserMutation()
  const [unfollowMutation] = useUnfollowUserMutation()

  const [getUserInfoQuery] = useLazyGetUserInfoQuery();
  const [getUserPostsQuery] = useLazyGetUserPostsQuery();
  
  function handleCopyLink(): void {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
  }
  
  const isFollowing = userProfileInfo?.followers.some(follower => follower._id === authenticatedUser?._id)
  
  function toggleFollowAndUnfollowHandler(): void {
    if(!authenticatedUser || !userProfileInfo) return

    if(isFollowing){
      dispatch(unfollowUser(authenticatedUser))
      unfollowMutation({token, userToFollowId: userProfileInfo._id})
    } else {
      dispatch(followUser(authenticatedUser))
      followMutation({token, userToFollowId: userProfileInfo._id})
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
  }, [username]);

  useEffect(() => {
    async function getUserPosts(): Promise<void> {
      if (!userProfileInfo) return;

      try {
        const userPosts = await getUserPostsQuery(userProfileInfo._id).unwrap()
        if (userPosts) {
          dispatch(setUserPosts(userPosts));
        }
      } catch (error) {
        console.error(error);
      }
    }
    getUserPosts();
  }, [userProfileInfo?._id]);
  
  return (
    <section className="bg-matteBlack w-full flex py-[90px] justify-center">
      <div
        className={`max-w-[1400px] h-full  w-full ${
          authenticatedUser ? "md:ml-[120px] md:mr-[50px] lg:ml-[250px]" : null
        } flex justify-center`}
      > 
        {toEditUserInfo && <EditUserProfileModal />}
        <main className="w-full flex items-center flex-col gap-3 max-w-[700px]">
          {/* user infos */}
          <div className="w-full flex flex-col gap-4 p-4">
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
                onClick={() => userProfileInfo?.displayed_picture && dispatch(setImageUrl(userProfileInfo?.displayed_picture?.url))}
              />
            </div>
            {/*end of username and dp */}
            <div className="flex flex-col gap-4">
              {/* bio */}
              <p className="text-white text-xs max-w-[300px]">
                {userProfileInfo?.bio}
              </p>
              <p className="text-[#959494c9] text-xs">
                <span>{userProfileInfo?.followerCount} {userProfileInfo?.followerCount && userProfileInfo?.followerCount > 1 ? "followers" : "follower"} </span> ·{" "}
                <a href={userProfileInfo?.link}>{userProfileInfo?.link}</a>
              </p>
              {authenticatedUser && token && (
                <div className="flex gap-4">
                  {username === authenticatedUser?.username ? (
                    <button className="text-white text-xs px-6 border hover:bg-[#2322225e] border-[#8d8c8c] py-2 rounded-md w-full" onClick={() => dispatch(setToEditUserInfo(userProfileInfo))}>
                      Edit Profile
                    </button>
                  ) : (
                    <button className={`${isFollowing ? "border border-[#8d8c8c] hover:bg-[#2322225e] text-white" : "bg-white text-black font-semibold"} text-xs px-6 border py-2 rounded-md w-full`} onClick={toggleFollowAndUnfollowHandler}>
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

          {/* user posts */}
          <div className="flex flex-col w-full">
            {userPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                token={token}
                authenticatedUser={authenticatedUser}
              />
            ))}
          </div>
        </main>
      </div>
    </section>
  );
};

export default Profile;
