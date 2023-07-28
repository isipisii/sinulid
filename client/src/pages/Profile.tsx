import { JSX, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLazyGetUserInfoQuery } from "../services/authAndUserApi";
import {useLazyGetUserPostsQuery,} from "../services/postApi";
import { useAppDispatch, useAppSelector } from "../features/app/hooks";
import { setUserInfo } from "../features/user/userProfileSlice";
import { setUserPosts } from "../features/user/userProfileSlice";
import PostCard from "../components/PostCard";

const Profile = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { user: authenticatedUser, token } = useAppSelector((state) => state.auth);
  const { userPosts } = useAppSelector((state) => state.userProfile)
  const { userProfileInfo } = useAppSelector((state) => state.userProfile);
  const { username } = useParams();
  const [getUserInfoQuery] = useLazyGetUserInfoQuery();
  const [getUserPostsQuery] = useLazyGetUserPostsQuery();

  const handleCopyLink = (): void => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
  };

  useEffect(() => {
    async function getUserInfo() {
      if (!username) return;

      try {
        const user = await getUserInfoQuery(username).unwrap();
        if (user) {
          dispatch(setUserInfo(user));
        }
      } catch (error) {
        console.error(error);
      }
    }
    getUserInfo();
  }, [username]);

  useEffect(() => {
    async function getUserPosts() {
      if (!userProfileInfo) return;

      try {
        const userPosts = await getUserPostsQuery(userProfileInfo._id).unwrap();
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
    <section className="bg-matteBlack w-full h-auto flex py-[90px] justify-center">
      <div className={`max-w-[1400px] h-auto w-full ${authenticatedUser ? "md:ml-[120px] md:mr-[50px] lg:ml-[250px]" : null} flex justify-center`}>
        <main className="w-full flex items-center  flex-col gap-3 max-w-[800px]">
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
                className="h-[80px] w-[80px] rounded-full"
              />
            </div>
            {/*end of username and dp */}
            <div className="flex flex-col gap-4">
              {/* bio */}
              <p className="text-white text-xs max-w-[300px]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
              <p className="text-[#5f5a5a9d] text-xs">
                <span>1,000 followers</span> ·{" "}
                <span>https://www.youtube.com/</span>
              </p>
              {username === authenticatedUser?.username ? (
                <div className="flex gap-4">
                  <button className="text-white text-sm px-6 border border-borderColor py-2 rounded-md w-full">
                    Edit Profile
                  </button>
                  <button
                    className="text-white text-sm px-6 border border-borderColor py-2 rounded-md w-full"
                    onClick={handleCopyLink}
                  >
                    Copy Link
                  </button>
                </div>
              ) : (
                <div className="flex gap-4">
                  <button className="text-black bg-white text-sm px-6 border py-2 rounded-md w-full">
                    Follow
                  </button>
                  <button
                    className="text-white text-sm px-6 border border-borderColor py-2 rounded-md w-full"
                    onClick={handleCopyLink}
                  >
                    Copy Link
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* end of user infos */}

          {/* user feed */}
          <div className="flex flex-col w-full">
            {userPosts.map((post, index) => (
              <PostCard
                key={index}
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
