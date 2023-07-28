import { FC, useEffect } from "react";
import { setPosts } from "../features/post/postSlice";
import { useLazyGetPostsQuery } from "../services/postApi";
import { useAppDispatch } from "../features/app/hooks";
import Feed from "../components/Feed";
import CreateAndEditPostForm from "../components/CreateAndEditPostForm";

interface IHome {
  getUserInfo: () => Promise<void>
}

const Home: FC<IHome> = ({ getUserInfo }) => {
  const dispatch = useAppDispatch();
  const [getLazyPostsQuery] = useLazyGetPostsQuery();

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

  // get the user info  and posts once rendered
  useEffect(() => {
    getPosts();
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="bg-matteBlack w-full flex items-center justify-center">
      <div className="max-w-[1400px] h-auto w-full flex justify-center gap-4 md:ml-[120px] md:mr-[50px] lg:ml-[250px]">
        <main className="w-full pt-[90px] flex items-center flex-col justify-center gap-3 sm:mx-[50px]  max-w-[800px]">
          <CreateAndEditPostForm isEditing={false} />
          <Feed />
        </main>
        {/* may ikaag */}
      </div>
    </section>
  );
};

export default Home;
