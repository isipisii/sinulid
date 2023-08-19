import { FC, useEffect } from "react";
import { setPosts } from "../features/post/postSlice";
import { useLazyGetPostsQuery } from "../services/postApi";
import { useAppDispatch, useAppSelector } from "../features/app/hooks";
import Feed from "../components/Feed";
import CreateAndEditPostForm from "../components/forms/CreateAndEditPostForm";
import { useLazyGetUserPostsAndRepostsQuery } from "../services/authAndUserApi";
import { setUserPostsAndReposts } from "../features/user/userProfileSlice";
import useDocumentTitle from "../hooks/useDocumentTitle";
import ThreadCardLoader from "../components/loader/ThreadCardLoader";

interface IHome {
  getUserInfo: () => Promise<void>;
}

const Home: FC<IHome> = ({ getUserInfo }) => {
  const dispatch = useAppDispatch();
  const [getLazyPostsQuery, { isLoading: isGetPostsLoading }] =
    useLazyGetPostsQuery();
  const [getPostsAndRepostsQuery, { isLoading: isGetPostsAndRepostsLoading }] =
    useLazyGetUserPostsAndRepostsQuery();
  const { user: authenticatedUser } = useAppSelector((state) => state.auth);
  useDocumentTitle("Threads Clone");

  // gets the user reposts and posts in this component so that if this page rendered, then we can easily identify the post that has been reposted
  useEffect(() => {
    async function getUserRepostsAndPosts(): Promise<void> {
      if (!authenticatedUser) return;

      try {
        const userPostsAndRepostsPayload = await getPostsAndRepostsQuery(
          authenticatedUser?._id
        ).unwrap();
        if (userPostsAndRepostsPayload) {
          dispatch(setUserPostsAndReposts(userPostsAndRepostsPayload));
        }
      } catch (error) {
        console.error(error);
      }
    }
    getUserRepostsAndPosts();
  }, [
    authenticatedUser?._id,
    dispatch,
    getPostsAndRepostsQuery,
    authenticatedUser,
  ]);


  // get the user info  and posts once rendered
  useEffect(() => {
    async function getPosts() {
      try {
        const postsPayload = await getLazyPostsQuery();
        if (postsPayload?.data) {
          dispatch(setPosts(postsPayload?.data));
        }
      } catch (error) {
        console.error(error);
      }
    }
    getPosts();
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="bg-matteBlack w-full flex items-center justify-center pb-[100px]">
      <div className="max-w-[1400px] h-auto w-full flex justify-center gap-4 md:ml-[120px] md:mr-[50px] lg:ml-[250px]">
        <main className="w-full pt-[90px] flex items-center flex-col justify-center sm:mx-[50px] max-w-[600px]">
          <div className="border-b border-borderColor w-full">
            <CreateAndEditPostForm isEditing={false} />
          </div>
          {isGetPostsAndRepostsLoading || isGetPostsLoading ? (
            <div className="w-full flex flex-col">
              {[...new Array(6)].map((_, index) => (
                <ThreadCardLoader index={index} key={index} />
              ))} 
          </div>
          ) : (
            <Feed />
          )}
        </main>
      </div>
    </section>
  );
};

export default Home;
