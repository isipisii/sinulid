import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChangeEvent } from "react";
import { useLazyGetSearchedUsersQuery } from "../services/authAndUserApi";
import { useDebounce } from "use-debounce";
import { BiSearch } from "react-icons/bi";
import { RotatingLines } from "react-loader-spinner";
import { User } from "../types/types";
import { useAppSelector } from "../features/app/hooks";

import UserCard from "../components/cards/UserCard";

const SearchUserPage = () => {
  const [search, setSearch] = useSearchParams();
  const [getSearchedUsers, { isFetching }] = useLazyGetSearchedUsersQuery();
  const [debounceSearchTerm] = useDebounce(search.get("user"), 900);
  const [users, setUsers] = useState<User[]>([]);
  const { userDefaultProfileImage } = useAppSelector(
    (state) => state.userProfile
  );

  const handleUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch({ user: e.target.value });
  };

  // will automatically search whenever the user stops typing
  useEffect(() => {
    async function getUsers() {
      if (!debounceSearchTerm) return;
      try {
        const users = await getSearchedUsers(debounceSearchTerm).unwrap();
        setUsers(users);
      } catch (error) {
        console.error(error);
      }
    }
    getUsers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceSearchTerm]);

  return (
    <section className="bg-matteBlack w-full flex items-center justify-center pb-[100px]">
      <div className="max-w-[1400px] h-auto w-full flex justify-center gap-4 md:ml-[120px] md:mr-[50px] lg:ml-[250px]">
        <main className="w-full pt-[90px] flex items-start flex-col justify-center sm:mx-[50px] max-w-[600px] px-4 md:px-0">
          {/* search field */}
          <div className="flex-col items-start flex w-full gap-4">
            <h1 className="text-white font-medium text-center text-[2rem]">
              Search
            </h1>
            <div className="relative w-full">
              <p className="absolute text-[#4a4545] text-[1.3rem] left-2 top-[.6rem]">
                <BiSearch />
              </p>
              <input
                type="text"
                placeholder="Search"
                value={search.get("user") ?? ""}
                onChange={handleUsername}
                className="pl-8 bg-transparent border-borderColor border p-2 placeholder:text-[#4a4545] text-sm text-white focus:border-white focus:outline-none w-full rounded-md"
              />
            </div>
          </div>

          <div className="w-full">
            {isFetching ? (
              <div className="w-full h-[50vh] flex items-center justify-center">
                <RotatingLines
                  strokeColor="grey"
                  strokeWidth="4"
                  animationDuration="0.75"
                  width="30"
                  visible={true}
                />
              </div>
            ) : (
              users.length === 0 && debounceSearchTerm ? 
              <div className="w-full mt-8">
                <p className="text-sm text-lightText font-light pb-8 border-b border-borderColor">No results found for "{debounceSearchTerm}"</p>
              </div>
              : 
              <div className="flex flex-col mt-4">
                {users.map((user, index) => (
                  <UserCard user={user} userDefaultProfileImage={userDefaultProfileImage} key={index}/>
                ))}
              </div>
            )}
          </div>

        </main>
      </div>
    </section>
  );
};

export default SearchUserPage;
