import { FC, useEffect } from "react";
import { setPosts } from "../features/post/postSlice";
import { useLazyGetPostsQuery } from "../services/postApi";
import { useAppDispatch, useAppSelector } from "../features/app/hooks";
import Feed from "../components/Feed";
import CreateAndEditPostForm from "../components/CreateAndEditPostForm";
import { useLazyGetUserPostsAndRepostsQuery } from "../services/authAndUserApi";
import { setUserPostsAndReposts } from "../features/user/userProfileSlice";

interface IHome {
  getUserInfo: () => Promise<void>
}

const Home: FC<IHome> = ({ getUserInfo }) => {
  const dispatch = useAppDispatch();
  const [getLazyPostsQuery] = useLazyGetPostsQuery();
  const [getPostsAndRepostsQuery] = useLazyGetUserPostsAndRepostsQuery();
  const { user: authenticatedUser } = useAppSelector(state => state.auth)

  async function getPosts() {
    try {
      const payload = await getLazyPostsQuery();
      if (payload?.data) {
        dispatch(setPosts(payload?.data));
      }
    } catch (error) {
      console.error(error);
    }
  }


  useEffect(() => {
    async function getUserRepostsAndPosts(): Promise<void> {
      if (!authenticatedUser) return;

      try {
        const userPostsAndRepostsPayload = await getPostsAndRepostsQuery(authenticatedUser?._id).unwrap();
        if(userPostsAndRepostsPayload){
          dispatch(setUserPostsAndReposts(userPostsAndRepostsPayload))
        }
      } catch (error) {
        console.error(error);
      }
    }
    getUserRepostsAndPosts()
  }, [authenticatedUser?._id, dispatch, getPostsAndRepostsQuery, authenticatedUser ]);

  // get the user info  and posts once rendered
  useEffect(() => {
    getPosts();
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="bg-matteBlack w-full flex items-center justify-center pb-[100px]">
      <div className="max-w-[1400px] h-auto w-full flex justify-center gap-4 md:ml-[120px] md:mr-[50px] lg:ml-[250px]">
        <main className="w-full pt-[90px] flex items-center flex-col justify-center sm:mx-[50px] max-w-[700px]">
          <div className="border-b border-borderColor w-full">
            <CreateAndEditPostForm isEditing={false} />
          </div>
          <Feed />
        </main>
        {/* may ikaag */}
      </div>
    </section>
  );
};

export default Home;
