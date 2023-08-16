import { JSX } from "react";
import { GoHome, GoHomeFill } from "react-icons/go";
import { HiOutlineUser, HiUser } from "react-icons/hi"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BiSolidSearch, BiSearch } from "react-icons/bi"

import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAppSelector } from "../features/app/hooks";

const SideBarAndBottomNav = (): JSX.Element => {
  const { user: authenticatedUser, token } = useAppSelector(state => state.auth)
  const location = useLocation();
  const isActive = (currentPath: string): boolean => location.pathname === currentPath

  const barLinks = [
    {
      linkName: "Home",
      activeIcon: <GoHomeFill />,
      inactiveIcon: <GoHome />, 
      linkTo: "/",
    },
    {
      linkName: "Activity",
      activeIcon: <AiFillHeart />,
      inactiveIcon: <AiOutlineHeart />,
      linkTo: "/activity/all",
    },
    {
      linkName: "Search",
      activeIcon: <BiSolidSearch />,
      inactiveIcon: <BiSearch />,
      linkTo: "/search",
    },
    {
      linkName: "Profile",
      activeIcon: <HiUser />,
      inactiveIcon: <HiOutlineUser />,
      linkTo: `/profile/${authenticatedUser?.username}`,
    },
  ];

  return (
    <>
      {location.pathname !== "/signup" && location.pathname !== "/login" && (authenticatedUser !== null && token) && (
        <>
          <aside className="md:w-[20%] lg:w-[40%] hidden md:block">
            <div className="w-auto flex flex-col h-[100vh] mt-[70px] fixed overflow-auto border-r border-borderColor p-3">
              <ul className="flex flex-col gap-3 pt-6">
                {barLinks.map((link, index) => (
                  <Link to={link.linkTo} key={index}>
                    <li
                      className={`flex items-center gap-2 md:p-4 lg:pl-3 lg:py-3 lg:pr-[6rem] ease-in-out duration-300 hover:bg-[#4e4a4a48] rounded-lg 
                      ${isActive(link.linkTo) ? "bg-[#4e4a4a48]  text-white" : "text-[#787878]"}`}
                    >
                      <p className="text-[1.7rem]">{isActive(link.linkTo) ? link.activeIcon : link.inactiveIcon}</p>
                      <p className="text-[.9rem] md:hidden lg:block">
                        {link.linkName}
                      </p>
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          </aside>

          {/* bottom nav */}
          <div className="block md:hidden fixed m-auto bottom-0 left-0 right-0 z-20 w-full bg-matteBlack border-white  p-2 shadow-2xl shadow-[#100f0faf]">
            <ul className="flex flex-row justify-around w-full">
              {barLinks.map((link, index) => (
                <Link to={link.linkTo} key={index}>
                  <li
                    className={`flex items-center gap-2  ${isActive(link.linkTo) ? "text-white" : "text-[#787878]"} p-3 rounded-md`}
                  >
                    <p className="text-[1.7rem]">{isActive(link.linkTo) ? link.activeIcon : link.inactiveIcon}</p>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default SideBarAndBottomNav;
