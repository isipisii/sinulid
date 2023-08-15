import { FC } from "react";
import { User } from "../../types/types";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../features/app/hooks";

interface IUserCard {
  user: User;
}

const UserCard: FC<IUserCard> = ({ user }) => {

  const { userDefaultProfileImage } = useAppSelector((state) => state.userProfile);
  const { user: authenticatedUser } = useAppSelector((state) => state.auth);

  return (
    <div className="w-full flex gap-3 items-center">
      <img
        src={
          user.displayed_picture?.url
            ? user.displayed_picture.url
            : userDefaultProfileImage
        }
        alt="profile image"
        className="h-[40px] w-[40px] object-cover rounded-full"
      />

      <div className="py-4 border-b border-borderColor w-full flex justify-between items-center">
        <Link to={`/profile/${user.username}`} className="w-full">
          <div className="flex-col flex gap-1 w-full">
            <h1 className="text-sm text-white font-medium">{user.username}</h1>
            <p className="text-sm text-lightText font-light">{user.name}</p>
          </div>
        </Link>
       {user._id !== authenticatedUser?._id && 
       <button className="border border-borderColor text-sm text-white py-[.30rem] px-5 rounded-lg">
          Follow
        </button>}
      </div>
    </div>
  );
};

export default UserCard;
