import { JSX } from "react";
import { useAppDispatch } from "../features/app/hooks";
import { setToken, setUser } from "../features/auth/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../features/app/hooks";

const NavBar = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  function handleLogout() {
    localStorage.removeItem("token");
    dispatch(setToken(""));
    dispatch(setUser(null));
    navigate("/login");
  }

  return (
    <>
      {location.pathname !== "/signup" && location.pathname !== "/login" && (
          <nav className="w-full backdrop-blur-sm bg-[#101010de] fixed z-20 flex items-center justify-center border-borderColor border-b">
            <div className=" flex items-center justify-between p-4 w-full h-auto">
              <h1 className="text-white font-bold">sinolid.</h1>
              <div className="border border-borderColor p-2 flex gap-2 items-center rounded-md">
                <img
                  src={
                    user?.displayed_picture
                      ? user.displayed_picture?.url
                      : "https://greenacresportsmed.com.au/wp-content/uploads/2018/01/dummy-image.jpg"
                  }
                  alt=""
                  className="h-[20px] w-[20px] rounded-full object-cover"
                  onClick={handleLogout}
                />
                <p className="text-white text-xs">{user?.username}</p>
              </div>
            </div>
          </nav>
        )}
    </>
  );
};

export default NavBar;
