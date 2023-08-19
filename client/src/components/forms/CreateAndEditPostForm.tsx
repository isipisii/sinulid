import { useState, FormEvent, FC } from "react";
import { useAppSelector, useAppDispatch } from "../../features/app/hooks";
import { useNavigate } from "react-router-dom";
import {
  useCreatePostMutation,
  useUpdatePostMutation,
  useCreatePostReplyMutation,
} from "../../services/postApi";
import { FiPaperclip } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import {
  addPost,
  setPostToEdit,
  updatePost,
  updatePostReply,
  updateUserReplyInUserReplies,
} from "../../features/post/postSlice";
import { updatePostOrRepostInUserProfile } from "../../features/user/userProfileSlice";

import { Toaster } from "react-hot-toast";
import { showToast } from "../../util/showToast";
import Spinner from "../loader/Spinner";
import TextareaAutosize from "react-textarea-autosize";

interface ICreatePostForm {
  isEditing?: boolean;
  parentPostId?: string;
  isReplying?: boolean;
  postToReplyCreatorUsername?: string;
}

const CreatePostForm: FC<ICreatePostForm> = ({
  isEditing,
  parentPostId,
  isReplying,
  postToReplyCreatorUsername,
}) => {
  const { postToEdit } = useAppSelector((state) => state.post);
  const { userDefaultProfileImage } = useAppSelector(
    (state) => state.userProfile
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState<string>(
    isEditing ? postToEdit?.content || "" : ""
  );
  const [imagePreview, setImagePreview] = useState<string>(
    isEditing ? postToEdit?.image?.url || "" : ""
  );
  const { user, token } = useAppSelector((state) => state.auth);
  const [createPostMutation, { isLoading: isPosting }] =
    useCreatePostMutation();
  const [createPostReplyMutation, { isLoading: isCreatingReply }] =
    useCreatePostReplyMutation();
  const [updatePostMutation, { isLoading: isUpdating }] =
    useUpdatePostMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

  async function updatePostHandler(e: FormEvent<HTMLFormElement>): Promise<void> {
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
      dispatch(updatePostReply(updatedPost));
      dispatch(updatePostOrRepostInUserProfile(updatedPost));
      dispatch(updateUserReplyInUserReplies(updatedPost));
      dispatch(setPostToEdit(null));
      showToast("Post updated");
    } catch (error) {
      showToast("Error, something went wrong while uploading", true);
      console.error(error);
    }
  }

  // for submitting the reply
  async function submitPostReplyHandler(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    // the data will be passed to req body
    const data = new FormData();
    data.append("content", textContent);

    if (imageFile) {
      data.append("image", imageFile);
    }

    if (parentPostId) {
      try {
        await createPostReplyMutation({
          postReplyData: data,
          token,
          parentId: parentPostId,
        }).unwrap();
        clearForm();
        navigate(`/${postToReplyCreatorUsername}/post/${parentPostId}`);
      } catch (error) {
        showToast("Error, something went wrong while creating a reply", true);
        console.error(error);
      }
    }
  }
  // for posting root post/thread
  async function submitPostHandler(e: FormEvent<HTMLFormElement> ): Promise<void> {
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
      showToast("Error, something went wrong while uploading", true);
      console.error(error);
    }
  }

  function clearForm(): void {
    setTextContent("");
    setImagePreview("");
    setImageFile(null);
  }

  function buttonName(): string {
    //in post by default
    let buttonName = isPosting ? "Posting" : "Post"

    if(isEditing) {
      buttonName = isUpdating ? "Saving" : "Save"
    }
    if(isReplying) {
      buttonName = isCreatingReply ? "Submitting" : "Submit"
    }
      
    return buttonName
  }

  function isDisabled(): boolean {
     //in post by default
    let isDisabled = isPosting ? true : false

    if(isEditing) {
      isDisabled = isUpdating ? true : false
    }
    if(isReplying) {
      isDisabled = isCreatingReply ? true : false
    }

    return isDisabled
  }

  return (
    <div className="w-full h-auto">
      <form
        className={`flex flex-col gap-3 h-auto ${
          isReplying ? null : "p-4"
        } bg-matteBlack rounded-md`}
        onSubmit={
          isEditing
            ? updatePostHandler
            : isReplying
            ? submitPostReplyHandler
            : submitPostHandler
        }
      >
        {isEditing && (
          <h2 className="text-center text-white font-medium">Edit post</h2>
        )}
        <div className="h-auto w-full flex flex-col gap-3">
          {!isReplying && (
            <div className="flex gap-2 items-center">
              <img
                src={
                  user?.displayed_picture
                    ? user?.displayed_picture?.url
                    : userDefaultProfileImage
                }
                alt="user profile"
                className="h-[40px] w-[40px] rounded-full object-cover"
              />
              <h2 className="font-semibold text-sm text-white">
                {user?.username}
              </h2>
            </div>
          )}
          <div
            className={` ${isReplying ? null : "max-h-[330px] overflow-auto"}`}
          >
            <div className="w-full h-full flex flex-col flex-grow gap-3">
              <TextareaAutosize
                minRows={isReplying ? 1 : 2}
                maxRows={6}
                autoFocus={isEditing || isReplying ? true : false}
                placeholder={
                  isEditing
                    ? "Edit thread..."
                    : isReplying
                    ? `Reply to ${postToReplyCreatorUsername}...`
                    : "Start a thread..."
                }
                onChange={(e) => setTextContent(e.target.value)}
                value={textContent}
                className={`h-full outline-none text-white text-sm w-full py-2 ${
                  isReplying ? null : "border-borderColor border px-2"
                } bg-matteBlack rounded-lg placeholder:text-[#4a4545]`}
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
            className={` ${textContent || imageFile ? "bg-white hover:bg-[#e5e2e2bd] ease-in-out duration-300 " : "bg-[#ffffff8a]"} px-6 py-2 font-semibold rounded-md text-xs md:text-sm flex gap-2 items-center 
            ${textContent || imageFile || isPosting || isUpdating || isCreatingReply ? "cursor-pointer" : "cursor-not-allowed"}`}
            disabled={isDisabled()}
            type="submit"
          >
            {buttonName()}
            {isUpdating  && (
              <Spinner fillColor="fill-black" pathColor="text-gray-400" />
            )}
            {isCreatingReply && (
              <Spinner fillColor="fill-black" pathColor="text-gray-400" />
            )}
            {isPosting   && (
              <Spinner fillColor="fill-black" pathColor="text-gray-400" />
            )}
          </button>
        </div>
        <Toaster position="bottom-center" reverseOrder={false} />
      </form>
    </div>
  );
};

export default CreatePostForm;
