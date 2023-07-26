import { JSX } from "react";
import { HiMiniHome } from "react-icons/hi2";
import { AiOutlineUser, AiOutlineHeart } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const SideBarAndBottomNav = (): JSX.Element => {
  const location = useLocation();
  const barLinks = [
    {
      linkName: "Home",
      icon: <HiMiniHome />,
      linkTo: "/",
    },
    {
      linkName: "Activity",
      icon: <AiOutlineHeart />,
      linkTo: "/activity",
    },
    {
      linkName: "Profile",
      icon: <AiOutlineUser />,
      linkTo: "/profile",
    },
  ];

  return (
    <>
      {location.pathname !== "/signup" && location.pathname !== "/login" && (
        <>
          <aside className="md:w-[20%] lg:w-[40%] hidden md:block">
            <div className="w-auto flex flex-col h-[100vh] mt-[70px] fixed overflow-auto border-r border-borderColor p-3">
              <ul className="flex flex-col gap-3 pt-6">
                {barLinks.map((link, index) => (
                  <Link to={link.linkTo} key={index}>
                    <li
                      className="flex items-center gap-2 text-white md:p-4 lg:pl-3 lg:py-3 lg:pr-[6rem] hover:bg-[#42404042] rounded-md"
                    >
                      <p className="text-[1.7rem]">{link.icon}</p>
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
                    <p className="text-[1.7rem]">{link.icon}</p>
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
