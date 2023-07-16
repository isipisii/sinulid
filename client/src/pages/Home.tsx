import { FC, useEffect } from "react";
import { useAppSelector } from "../features/app/hooks";
import { useNavigate } from "react-router-dom";
import { setToken } from "../features/auth/authSlice";
import { useAppDispatch } from "../features/app/hooks";
import SideBar from "../components/SideBar";
import Feed from "../components/Feed";

interface IHome {
  getUserInfo: () => void;
}

const Home: FC<IHome> = ({ getUserInfo }) => {
  // const dispatch = useAppDispatch();
  // const navigate = useNavigate();
  const { user }  =  useAppSelector(state => state.auth)
  // get the user info once rendered
  useEffect(() => {
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="bg-matteBlack w-full flex items-center justify-center px-4">
      <div className="max-w-[1400px] h-auto w-full flex gap-4">
        <SideBar userInfo={user} />
        <Feed />
        <SideBar userInfo={user} />
      </div>
    </section>
  );
};

export default Home;
