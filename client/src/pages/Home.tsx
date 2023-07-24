import { FC, useEffect } from "react";
import { useAppSelector } from "../features/app/hooks";
import { setPosts } from "../features/post/postSlice";
import { useLazyGetPostsQuery } from "../services/postApi";
import { useAppDispatch } from "../features/app/hooks";
import SideBar from "../components/SideBar";
import Feed from "../components/Feed";
import CreatePostForm from "../components/CreatePostForm";

interface IHome {
  getUserInfo: () => void;
}

const Home: FC<IHome> = ({ getUserInfo }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
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
    getUserInfo();
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="bg-matteBlack w-full flex items-center justify-center md:px-4">
      <div className="max-w-[1400px] h-auto w-full flex gap-4">
        <SideBar userInfo={user} />
        <main className="w-full pt-[70px] flex items-center flex-col justify-center gap-3 sm:mx-[50px] md:mx-[0px] max-w-[900px]">
          <CreatePostForm />
          <Feed />
        </main>
        <SideBar userInfo={user} />
      </div>
    </section>
  );
};

export default Home;
