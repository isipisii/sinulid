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
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // get the user info once rendered
  useEffect(() => {
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    dispatch(setToken(""));
    navigate("/login");
  }

  return (
    <section className="bg-matteBlack h-[100vh] flex justify-between items-center p-4 relative gap-4">
      <SideBar userInfo={user} handleLogout={handleLogout} />
      <Feed />
    </section>
  );
};

export default Home;
