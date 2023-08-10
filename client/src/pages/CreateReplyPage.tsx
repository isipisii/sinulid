import { JSX, useEffect, useState } from "react";
import { useAppSelector } from "../features/app/hooks";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { useLazyGetSinglePostQuery } from "../services/postApi";
import { Post } from "../types/types";
import CreatePostForm from "../components/form/CreateAndEditPostForm";

const CreateReplyPage = (): JSX.Element => {
  const { user: authenticatedUser } = useAppSelector((state) => state.auth);
  const [getSinglePostQuery] = useLazyGetSinglePostQuery();
  const [postToReply, setPostReply] = useState<Post | null>(null);

  const navigate = useNavigate();
  const { postToReplyId } = useParams();

  useEffect(() => {
    async function getSinglePostAndReplies() {
      if (!postToReplyId) return;

      try {
        const post = await getSinglePostQuery(postToReplyId).unwrap();
        setPostReply(post);
        console.log(post)
      } catch (error) {
        console.error(error);
      }
    }
    getSinglePostAndReplies();
  }, [postToReplyId, getSinglePostQuery]);

  return (
    <section className="bg-matteBlack w-full flex items-center justify-center pb-[100px]">
      <div
        className={`max-w-[1400px] h-full  w-full ${
          authenticatedUser ? "md:ml-[120px] md:mr-[50px] lg:ml-[250px]" : null
        } flex justify-center`}
      >
        <main className="w-full pt-[90px] flex items-center flex-col justify-center sm:mx-[50px] max-w-[700px]">
          <div className="w-full relative mb-4">
            <p
              onClick={() => navigate(-1)}
              className=" cursor-pointer hover:bg-[#4e4a4a48] ease-in-out duration-300 p-2 rounded-md text-white absolute  my-auto left-2 md:left-0 text-sm flex items-center gap-1"
            >
              <IoIosArrowBack /> Back
            </p>
            <h1 className="text-white font-medium text-center text-[1.3rem]">
              Reply
            </h1>
          </div>

          {/* post to reply */}
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
                        : "https://greenacresportsmed.com.au/wp-content/uploads/2018/01/dummy-image.jpg"
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
                <div
                  className={`flex items-center w-full justify-between mb-1`}
                >
                  <Link to={`/profile/${postToReply?.creator.username}`}>
                    <h2 className="text-white font-medium text-xs hover:underline underline-offset-2">
                      {postToReply?.creator.username}
                    </h2>
                  </Link>
                </div>
                {/*end of post creator and other details */}

                {/* post content */}
                <div className="w-full">
                  <p className="text-xs text-[#ffffff] tracking-wide whitespace-pre-wrap break-words w-[320px] sm:w-[550px]">
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
          
          {/* form */}
          <div className="w-full h-auto p-3 mt-[-1rem]">
            <div className="flex gap-3">
              {/* left */}
              <div className="items-center flex flex-col gap-3">
                {/* post creator img */}
                <div className=" w-[35px] h-[35px]">
                  <img
                    src={
                      authenticatedUser?.displayed_picture
                        ? authenticatedUser?.displayed_picture.url
                        : "https://greenacresportsmed.com.au/wp-content/uploads/2018/01/dummy-image.jpg"
                    }
                    alt="profile picture"
                    className="rounded-full w-[35px] h-[35px] object-cover"
                  />
                </div>
              </div>

              {/* right */}
              <div className="w-full flex-col flex gap-1">
                {/* authenticated user */}
                <div
                  className={`flex flex-col w-full justify-between mb-1`}
                >
                  <Link to={`/profile/${authenticatedUser?.username}`}>
                    <h2 className="text-white font-medium text-xs hover:underline underline-offset-2">
                      {authenticatedUser?.username}
                    </h2>
                  </Link>
                 
                </div>
          
                <CreatePostForm 
                  isEditing={false} 
                  isReplying={true} 
                  parentPostId={postToReplyId}
                  postToReplyCreatorUsername={postToReply?.creator.username}
                />
              </div>
              
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default CreateReplyPage;
