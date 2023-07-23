import { FC } from "react";
import { User } from "../types/types";
import { Link } from "react-router-dom";

interface ISideBar {
  userInfo: User | null;
}

const SideBar: FC<ISideBar> = ({ userInfo }) => {
  const email = userInfo?.email?.split("@")[0]
  
  return (
    <aside className="w-[50%] hidden md:block h-[100vh]">
      <div className="w-auto flex flex-col justify-between h-[85vh] mt-[70px]  fixed overflow-auto">
        {/*current user profile */}
        <div className="flex items-center gap-3 bg-secondaryBg flex-col rounded-3xl w-[300px] p-4 ">
          {/* name, image, bio */}
          <div className="flex flex-col items-center w-full gap-3">
            <img
              src="https://greenacresportsmed.com.au/wp-content/uploads/2018/01/dummy-image.jpg"
              alt=""
              className="w-[70px] rounded-full"
            />
            <div className="flex flex-col gap-2">
              <div>
                <h1 className="text-white font-medium text-base text-center">
                  {userInfo?.username}
                </h1>
                <p className="text-lightText text-xs text-center">@{email}</p>
              </div>
              <p className="text-white text-xs text-center">
                Bioooooooo <br /> bio
              </p>
            </div>
          </div>

          {/* following and followers */}
          <div className="flex w-full border-t border-[#514e4eb7]">
            <div className="p-4 w-full flex-col flex items-center">
              <h5 className="text-white font-semibold">100</h5>
              <p className="text-lightText text-xs">Following</p>
            </div>
            <div className="p-4 w-full  flex-col flex items-center">
              <h5 className="text-white font-semibold">100</h5>
              <p className="text-lightText text-xs">Followers</p>
            </div>
          </div>

          <div className="border-t border-[#514e4eb7] w-full text-center pt-4">
            <Link to="/profile" className="text-cta font-semibold text-xs">
              View Profile
            </Link>
          </div>
        </div>
        {/*end of current user profile */}
      </div>
    </aside>
  );
};

export default SideBar;
