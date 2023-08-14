import { FC } from "react";

interface IThreadCardLoader {
  index: number;
}

const ThreadCardLoader: FC<IThreadCardLoader> = ({ index }) => {
  return (
    <div className=" w-full border-b border-borderColor p-4 flex gap-3">
      <div>
        <div className="animate-pulse bg-[#4444447e] h-[35px] w-[35px] rounded-full"></div>
      </div>

      <div className="flex-col flex gap-3 w-full">
        <div className="animate-pulse  bg-[#444444a5] h-[10px] w-[100px] rounded"></div>
        {index % 2 === 0 && (
          <div className="animate-pulse  bg-[#444444a5] h-[250px] w-full rounded"></div>
        )} 

        {index % 2 !== 0 && (
          <div className="w-full flex flex-col gap-1">
            <div className="animate-pulse  bg-[#444444a5] h-[10px] w-[150px] rounded"></div>
            <div className="animate-pulse  bg-[#444444a5] h-[10px] w-[80%] rounded"></div>
            <div className="animate-pulse  bg-[#444444a5] h-[10px] w-[70%] rounded"></div>
          </div>
        )}

        <div className="flex gap-2">
          <div className="animate-pulse bg-[#444444a5] h-[25px] w-[25px] rounded-full"></div>
          <div className="animate-pulse bg-[#444444a5] h-[25px] w-[25px] rounded-full"></div>
          <div className="animate-pulse bg-[#444444a5] h-[25px] w-[25px] rounded-full"></div>
          <div className="animate-pulse bg-[#444444a5] h-[25px] w-[25px] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ThreadCardLoader;
