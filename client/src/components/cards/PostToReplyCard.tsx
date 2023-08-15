import { FC } from "react";
import { Post } from "../../types/types";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../features/app/hooks";

interface IPost {
  postToReply: Post;
}

const PostToReplyCard: FC<IPost> = ({ postToReply }) => {
  const { userDefaultProfileImage } = useAppSelector(state => state.userProfile)

  return (
    <div className="w-full h-auto p-3">
      <div className="flex gap-3">
        {/* left */}
        <div className="items-center flex flex-col gap-2 min-h-[70px]">
          {/* post creator img */}
          <div className=" w-[35px] h-[35px]">
            <img
              src={
                postToReply?.creator?.displayed_picture
                  ? postToReply?.creator?.displayed_picture?.url
                  : userDefaultProfileImage
              }
              alt="profile picture"
              className="rounded-full w-[35px] h-[35px] object-cover"
            />
          </div>

          {/* line */}
          <div className="h-full relative">
            <svg
              width="3"
              height="100%"
              viewBox="0 0 3 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              className="absolute top-0 left-0 "
            >
              <path
                d="M1 1L1.01805 1000"
                stroke="#B0A2A2"
                strokeOpacity="0.73"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-[#ffffff39] stroke-2"
              />
            </svg>
          </div>
        </div>

        {/* right */}
        <div className="w-full flex-col flex gap-1">
          {/* post creator and other details */}
          <div className={`flex items-center w-full justify-between mb-1`}>
            <Link to={`/profile/${postToReply?.creator.username}`}>
              <h2 className="text-white font-medium text-sm hover:underline underline-offset-2">
                {postToReply?.creator.username}
              </h2>
            </Link>
          </div>
          {/*end of post creator and other details */}

          {/* post content */}
          <div className="w-full">
            <p className="text-sm text-[#ffffff] tracking-wide whitespace-pre-wrap break-words w-[320px] sm:w-[550px]">
              {postToReply?.content}
            </p>
          </div>

          {postToReply?.image && (
            <img
              src={postToReply?.image?.url}
              alt="post image"
              className=" w-full mt-2 mb-6 border border-borderColor rounded-md object-cover max-w-[600px]"
            />
          )}
          {/*end of post content */}
        </div>
      </div>
    </div>
  );
};

export default PostToReplyCard;
