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
    handleCopyLink: () => void
}

const UserProfileInfo: FC<IUserProfileInfo> = ({ userProfileInfo, token, authenticatedUser, username, toggleFollowAndUnfollowHandler, handleCopyLink }) => {
  const dispatch = useAppDispatch() 
  const { userDefaultProfileImage } = useAppSelector(state => state.userProfile)
  
  const isFollowing = userProfileInfo?.followers.some(
    (follower) => follower._id === authenticatedUser?._id
  );

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
                    <p className='text-[.65rem] bg-[#514c4c50] text-[#737272] py-[.30rem] px-2 rounded-full font-light'>threads.net</p>
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
                    className="text-white text-xs md:text-sm px-6 border hover:bg-[#2322225e] border-[#8d8c8c] py-2 rounded-lg w-full"
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
                    } text-sm px-6 border py-2 rounded-md w-full`}
                    onClick={toggleFollowAndUnfollowHandler}
                >
                    {isFollowing ? "Unfollow" : "Follow"}
                </button>
                )}
                <button
                    className="text-white hover:bg-[#2322225e] text-xs md:text-sm px-6 border border-[#8d8c8c] py-2 rounded-lg w-full"
                    onClick={handleCopyLink}
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