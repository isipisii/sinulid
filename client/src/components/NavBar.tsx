import { JSX, useState, useRef, useEffect } from "react";
import { useAppDispatch } from "../features/app/hooks";
import { setToken, setUser } from "../features/auth/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../features/app/hooks";
import { HiOutlineLogout } from "react-icons/hi"
import { BiSolidDownArrow }  from "react-icons/bi"
// import logoDark from "/assets/logo-dark.svg";
import logoLight from "/assets/logo-light.svg";

const NavBar = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const { userDefaultProfileImage } = useAppSelector(
    (state) => state.userProfile
  );
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);

  function handleLogout() {
    localStorage.removeItem("token");
    dispatch(setToken(""));
    dispatch(setUser(null));
    navigate("/login");
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideContextMenu, false);
    // cleanup function whenever the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutsideContextMenu, false);
    };
  }, []);

  // to hide the context menu when the user clicks outside the element or other element
  function handleClickOutsideContextMenu(e: MouseEvent): void {
    if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node) ) {
      setShowContextMenu(false);
    }
  }

  function toggleContextMenu(e: React.MouseEvent<HTMLDivElement>): void {
    e.stopPropagation();
    setShowContextMenu((prevState) => !prevState);
  }

  return (
    <>
      {location.pathname !== "/signup" && location.pathname !== "/login" && (
        <nav className="w-full backdrop-blur-sm bg-[#101010de] fixed z-20 flex items-center justify-center border-borderColor border-b ">
          <div className=" flex items-center justify-between p-4 w-full h-auto">
            <img src={logoLight} alt="logo" className="h-[30px] w-[30px]" />
            {user && token ? (
              <div className="border border-borderColor hover:bg-[#3a383830] ease-in-out duration-300 p-2 flex gap-2 items-center rounded-lg relative cursor-pointer" onClick={toggleContextMenu}>
                <img
                  src={
                    user?.displayed_picture
                      ? user.displayed_picture?.url
                      : userDefaultProfileImage
                  }
                  alt=""
                  className="h-[20px] w-[20px] rounded-full object-cover"
                />
                <div className="flex items-center gap-1">
                  <p className="text-white text-xs">{user?.username}</p>
                  <p className="text-white text-[.5rem]"><BiSolidDownArrow /></p>
                </div>

                {showContextMenu && (
                  <div
                    ref={contextMenuRef}
                    className="bg-matteBlack absolute right-0 top-[3rem] rounded-md h-auto z-10 w-[120px] border border-borderColor p-2 flex flex-col gap-1"
                  >
                    <button
                      className={`w-full text-red-600 text-xs p-3  cursor-pointer rounded-sm hover:bg-[#3a383830] ease-in-out duration-300 flex gap-2 justify-center items-center`}
                      onClick={handleLogout}
                      // disabled={isDeleting ? true : false}
                    >
                      <p>Logout</p>
                      <HiOutlineLogout className="text-[1rem]" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <h2
                className="text-white text-xs border border-borderColor p-2 rounded-md cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </h2>
            )}
          </div>
        </nav>
      )}
    </>
  );
};

export default NavBar;
