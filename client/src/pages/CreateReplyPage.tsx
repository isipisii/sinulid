import { JSX } from "react";
import { useAppSelector } from "../features/app/hooks";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { useGetSinglePostQuery } from "../services/postApi";

import CreatePostForm from "../components/forms/CreateAndEditPostForm";
import PostToReplyCard from "../components/cards/PostToReplyCard";
import { RotatingLines } from "react-loader-spinner";

const CreateReplyPage = (): JSX.Element => {
  const { postToReplyId } = useParams();
  const { user: authenticatedUser } = useAppSelector((state) => state.auth);
  const { userDefaultProfileImage } = useAppSelector(
    (state) => state.userProfile
  );
  const {data: postToReply, isFetching} = useGetSinglePostQuery(postToReplyId ?? "")
  const navigate = useNavigate();

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
            <h1 className="text-white font-medium text-center text-[2rem]">
              Reply
            </h1>
          </div>

          {isFetching || !postToReply? (
            <div className="h-[50vh] flex items-center justify-center">
              <RotatingLines
                strokeColor="grey"
                strokeWidth="4"
                animationDuration="0.75"
                width="25"
                visible={true}
              />
            </div>
          ) : (
            <>
              {/* post to reply */}
              <PostToReplyCard postToReply={postToReply} />

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
                            : userDefaultProfileImage
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
                        <h2 className="text-white font-medium text-sm hover:underline underline-offset-2">
                          {authenticatedUser?.username}
                        </h2>
                      </Link>
                    </div>

                    <CreatePostForm
                      isReplying={true}
                      parentPostId={postToReplyId}
                      postToReplyCreatorUsername={postToReply?.creator.username}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </section>
  );
};

export default CreateReplyPage;
