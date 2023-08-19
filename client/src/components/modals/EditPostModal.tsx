import { JSX } from "react";
import { useAppSelector, useAppDispatch } from "../../features/app/hooks";
import { setPostToEdit } from "../../features/post/postSlice";
import CreateAndEditPostForm from "../forms/CreateAndEditPostForm";
import { IoMdClose } from "react-icons/io";

const EditPostModal = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const { postToEdit } = useAppSelector((state) => state.post);

  return (
    <>
      {postToEdit  && (
        <div className="bg-[#000000bd] backdrop-blur-sm fixed w-[100vw] h-[100vh] z-20 top-0 left-0 flex items-center justify-center">
          {/* close icon */}
          <p className="top-5 right-5 text-[#525151] text-[1.2rem] md:text-[1.5rem] absolute p-2 md:p-3 font-thin rounded-full bg-[#252424ce] hover:bg-[#424141ba] cursor-pointer" onClick={() => dispatch(setPostToEdit(null))}>
            <IoMdClose />
          </p>
          <div className="w-[90%] max-w-[600px] border border-borderColor rounded-md">
            <CreateAndEditPostForm isEditing={true} />
          </div>
        </div>
      )}
    </>
  );
};

export default EditPostModal;
