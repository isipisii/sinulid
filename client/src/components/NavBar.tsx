import { FC } from "react";
import { useAppDispatch } from "../features/app/hooks";
import { setToken, setUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../features/app/hooks";

const NavBar: FC = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { user } = useAppSelector(state => state.auth)

  function handleLogout(){
    localStorage.removeItem("token");
    dispatch(setToken(""));
    dispatch(setUser(null))
    navigate("/login");
  }

  return (
    <nav className="w-full bg-matteBlack fixed z-10 flex items-center justify-center">
      <div className="max-w-[1400px] flex items-center justify-between p-4 w-full h-auto">
        <h1 className="text-cta font-bold">Sinulid</h1>
        <div className="bg-secondaryBg p-2 flex gap-4 items-center rounded-xl">
          <img
            src={user?.displayed_picture ? user.displayed_picture?.url : "https://greenacresportsmed.com.au/wp-content/uploads/2018/01/dummy-image.jpg"}
            alt=""
            className="h-[20px] w-[20px] rounded-full"
            onClick={handleLogout}
          />
          <p className="text-white text-xs">{user?.username}</p>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
