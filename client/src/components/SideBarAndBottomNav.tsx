import { JSX } from "react";
import { GoHome, GoHomeFill } from "react-icons/go";
import { HiOutlineUser, HiUser } from "react-icons/hi"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAppSelector } from "../features/app/hooks";

const SideBarAndBottomNav = (): JSX.Element => {
  const { user, token } = useAppSelector(state => state.auth)
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
      linkTo: "/activity",
    },
    {
      linkName: "Profile",
      activeIcon: <HiUser />,
      inactiveIcon: <HiOutlineUser />,
      linkTo: `/profile/${user?.username}`,
    },
  ];

  return (
    <>
      {location.pathname !== "/signup" && location.pathname !== "/login" && user !== null && (
        <>
          <aside className="md:w-[20%] lg:w-[40%] hidden md:block">
            <div className="w-auto flex flex-col h-[100vh] mt-[70px] fixed overflow-auto border-r border-borderColor p-3">
              <ul className="flex flex-col gap-3 pt-6">
                {barLinks.map((link, index) => (
                  <Link to={link.linkTo} key={index}>
                    <li
                      className={`flex items-center gap-2 text-white md:p-4 lg:pl-3 lg:py-3 lg:pr-[6rem] hover:bg-[#42404042] rounded-md 
                      ${isActive(link.linkTo) ? "bg-[#42404042]" : null}`}
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
          <div className="block md:hidden fixed m-auto bottom-4 left-0 right-0 z-20 w-full max-w-[250px] backdrop-blur-sm  bg-[#b7b5b5af] rounded-xl p-2 shadow-2xl shadow-[#100f0faf]">
            <ul className="flex flex-row justify-around w-full">
              {barLinks.map((link, index) => (
                <Link to={link.linkTo} key={index}>
                  <li
                    className="flex items-center gap-2 text-black p-3 rounded-md"
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
