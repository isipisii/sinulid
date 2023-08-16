import { JSX } from "react";
import { Link, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";

const Activity = (): JSX.Element => {
  const location = useLocation()
  useDocumentTitle("Threads Clone");

  const isActive = (pathname: string):boolean => pathname === location.pathname

  const chips = [
    {
      chipTitle: "All",
      linkTo: "/activity/all",
    },
    {
      chipTitle: "Follows",
      linkTo: "/activity/follows",
    },
    {
      chipTitle: "Replies",
      linkTo: "/activity/replies",
    },
    {
      chipTitle: "Likes",
      linkTo: "/activity/likes",
    },
  ];

  return (
    <section className="bg-matteBlack w-full flex items-center justify-center pb-[100px]">
      <div className="max-w-[1400px] h-auto w-full flex justify-center gap-4 md:ml-[120px] md:mr-[50px] lg:ml-[250px]">
        <main className="w-full pt-[90px] flex  flex-col gap-4 justify-center sm:mx-[50px] max-w-[600px] px-4 md:px-0">
          <h1 className="text-white font-medium text-left text-[2rem]">
            Activity
          </h1>

          <ul className="w-full flex gap-2">
            {chips.map((chip, index) => (
              <Link key={index} to={chip.linkTo} className="w-full">
                <li
                className={`${isActive(chip.linkTo) ? "text-black bg-white" : "text-white hover:bg-[#3a383830]"} w-full border border-borderColor 
                cursor-pointer text-center rounded-lg py-[.35rem] text-sm`}
                >
                  {chip.chipTitle}
                </li>
              </Link>
            ))}
          </ul>

          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default Activity;
