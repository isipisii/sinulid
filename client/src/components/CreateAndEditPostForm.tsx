import { useState, FormEvent, FC } from "react";
import { useAppSelector, useAppDispatch } from "../features/app/hooks";
import {
  useCreatePostMutation,
  useUpdatePostMutation,
} from "../services/postApi";
import { FiPaperclip } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { addPost, setPostToEdit, updatePost } from "../features/post/postSlice";
import { updatePostOrRepostInUserProfile } from "../features/user/userProfileSlice";

import { Toaster } from "react-hot-toast";
import { showToast } from "../util/showToast";
import Spinner from "./loader/Spinner";

interface ICreatePostForm {
  isEditing: boolean;
}

const CreatePostForm: FC<ICreatePostForm> = ({ isEditing }) => {
  const { postToEdit } = useAppSelector((state) => state.post);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState<string>(
    isEditing ? postToEdit?.content || "" : ""
  );
  const [imagePreview, setImagePreview] = useState<string>(
    isEditing ? postToEdit?.image?.url || "" : ""
  );
  const { user, token } = useAppSelector((state) => state.auth);
  const [createPostMutation, { isLoading: isCreating }] =
    useCreatePostMutation();
  const [updatePostMutation, { isLoading: isUpdating }] =
    useUpdatePostMutation();
  const dispatch = useAppDispatch();

  // this will set the selected image file to be uploaded and sets the image path for preview
  function handleSelectedFiles(selectedFiles: FileList | null): void {
    const selectedFile = selectedFiles && selectedFiles[0];

    if (selectedFile) {
      setImageFile(selectedFile);
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result) {
          setImagePreview(reader.result.toString());
        }
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreview("");
    }
  }

  function removeImage(): void {
    setImageFile(null);
    setImagePreview("");
  }

  async function updatePostHandler(
    e: FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();

    const data = new FormData();
    data.append("content", textContent);

    if (imageFile) {
      data.append("image", imageFile);
    }

    if (!postToEdit) return;

    try {
      const updatedPost = await updatePostMutation({
        postId: postToEdit?._id,
        token,
        updatePostData: data,
      }).unwrap();
      dispatch(updatePost(updatedPost));
      dispatch(updatePostOrRepostInUserProfile(updatedPost));
      dispatch(setPostToEdit(null));
      showToast("Post updated");
    } catch (error) {
      showToast("Error, something went wrong while uploading", true)
      console.error(error);
    }
  }

  async function submitPostHandler(
    e: FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    // the data will be passed to req body
    const data = new FormData();
    data.append("content", textContent);

    if (imageFile) {
      data.append("image", imageFile);
    }
    try {
      const newPost = await createPostMutation({
        postData: data,
        token,
      }).unwrap();
      dispatch(addPost(newPost));
      clearForm();
      showToast("Posted");
    } catch (error) {
      showToast("Error, something went wrong while uploading", true)
      console.error(error);
    }
  }

  function clearForm(): void {
    setTextContent("");
    setImagePreview("");
    setImageFile(null);
  }

  return (
    <div className="w-full h-auto">
      <Toaster position="bottom-center" reverseOrder={false} />
      <form
        className="flex flex-col gap-3 h-auto p-4 bg-matteBlack rounded-md"
        onSubmit={isEditing ? updatePostHandler : submitPostHandler}
      >
        {isEditing && (
          <h2 className="text-center text-white font-medium">Edit post</h2>
        )}
        <div className="h-auto w-full flex flex-col gap-3">
          <div className="flex gap-2 items-center">
            <img
              src={
                user?.displayed_picture
                  ? user?.displayed_picture?.url
                  : "https://greenacresportsmed.com.au/wp-content/uploads/2018/01/dummy-image.jpg"
              }
              alt="user profile"
              className="h-[40px] w-[40px] rounded-full object-cover"
            />
            <h2 className="font-semibold text-sm text-white">
              {user?.username}
            </h2>
          </div>
          <div className="max-h-[330px] overflow-auto">
            <div className="w-full h-full flex flex-col flex-grow gap-3">
              <textarea
                name="post"
                autoFocus={isEditing ? true : false}
                placeholder={isEditing ? "Edit thread..." : "Start a thread..."}
                className="h-full outline-none text-white p-2 text-xs w-full border-borderColor border bg-matteBlack rounded-md placeholder:text-[#4a4545]"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
              />
              {imagePreview && (
                <div className="w-full relative max-w-[500px]">
                  <p
                    className="top-2 right-2 text-white text-[1.3rem] absolute p-1 rounded-full bg-[#3d3d3dad] hover:bg-[#4f4c4c] cursor-pointer"
                    onClick={removeImage}
                  >
                    <IoMdClose />
                  </p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full rounded-md "
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="file-input"
            className="cursor-pointer text-lightText hover:text-[#636060c4] text-[1.1rem] border border-borderColor p-2 rounded-md"
          >
            <FiPaperclip />
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={(e) => handleSelectedFiles(e.target.files)}
            className="hidden"
          />
          <button
            className={`bg-white px-6 py-2 font-semibold rounded-md text-sm flex gap-2 items-center ${
              textContent || imageFile || isCreating || isUpdating
                ? "cursor-pointer"
                : "cursor-not-allowed"
            }`}
            disabled={
              textContent || imageFile || isCreating || isUpdating
                ? false
                : true
            }
            type="submit"
          >
            {isEditing
              ? isUpdating
                ? "Saving"
                : "Save"
              : isCreating
              ? "Posting"
              : "Post"}
            {isUpdating && (
              <Spinner fillColor="fill-black" pathColor="text-gray-400" />
            )}
            {isCreating && (
              <Spinner fillColor="fill-black" pathColor="text-gray-400" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;
