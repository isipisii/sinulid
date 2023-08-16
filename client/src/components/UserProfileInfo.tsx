import { FC } from 'react'
import { User } from '../types/types'
import { useAppDispatch, useAppSelector} from '../features/app/hooks'
import { setImageUrl } from '../features/post/postSlice'
import { setToEditUserInfo } from '../features/user/userProfileSlice'

interface IUserProfileInfo {
    userProfileInfo: User | null
    authenticatedUser: User | null
    token:string
    username: string
    toggleFollowAndUnfollowHandler: () => void
}

const UserProfileInfo: FC<IUserProfileInfo> = ({ userProfileInfo, token, authenticatedUser, username, toggleFollowAndUnfollowHandler }) => {
  const dispatch = useAppDispatch() 
  const { userDefaultProfileImage } = useAppSelector(state => state.userProfile)
  
  const isFollowing = userProfileInfo?.followers.some(
    (follower) => follower._id === authenticatedUser?._id
  );

  function shareProfile(){
    const data = {
        title: "Threads",
        text: `Come and check @${userProfileInfo?.username}'s profile on threads!`,
        url: `http://127.0.0.1:5173/profile/${userProfileInfo?.username}`
    }
    if(navigator.share) navigator.share(data)
  }

  return (
    <div className="w-full flex flex-col gap-4 p-4 md:p-0">
        {/* username and dp */}
        <div className="flex items-center justify-between w-full">
            <div className="flex flex-col">
                <h1 className="text-white text-[1.6rem] font-semibold">
                    {userProfileInfo?.name}
                </h1>
                <div className='flex items-center gap-1'>
                    <p className="text-white text-sm">{userProfileInfo?.username} </p>
                    <p className='text-[.65rem] bg-[#36353560] text-[#989696] py-[.35rem] px-2 rounded-full font-light'>threads.net</p>
                </div>
            </div>
            <img
                src={
                    userProfileInfo?.displayed_picture
                    ? userProfileInfo?.displayed_picture?.url
                    : userDefaultProfileImage
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
            <p className="text-white text-sm max-w-[300px]">
            {userProfileInfo?.bio}
            </p>
            <p className="text-[#959494c9] text-sm truncate w-[80%]">
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
                    className="text-white text-xs md:text-sm px-6 border ease-in-out duration-300 hover:bg-[#3a383830] border-[#8d8c8c] py-2 rounded-lg w-full"
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
                        ? "border border-[#8d8c8c] hover:bg-[#3a383830] text-white"
                        : "bg-white text-black "
                    } text-sm px-6 border py-2 rounded-lg w-full ease-in-out duration-300`}
                    onClick={toggleFollowAndUnfollowHandler}
                >
                    {isFollowing ? "Unfollow" : "Follow"}
                </button>
                )}
                <button
                    className="text-white hover:bg-[#3a383830] ease-in-out duration-300 text-xs md:text-sm px-6 border border-[#8d8c8c] py-2 rounded-lg w-full"
                    onClick={shareProfile}
                >
                Share Profile
                </button>
            </div>
            )}
        </div>
     </div>
  )
}

export default UserProfileInfo