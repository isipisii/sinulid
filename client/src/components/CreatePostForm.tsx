import { useState, FormEvent } from "react";
import { useAppSelector, useAppDispatch } from "../features/app/hooks";
import { useCreatePostMutation } from "../services/postApi";
import { FiPaperclip } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { addPost } from "../features/post/postSlice";

const CreatePostForm = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const { user, token } = useAppSelector((state) => state.auth);
  const [createPost] = useCreatePostMutation()
  const dispatch = useAppDispatch()

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

  function removeImage(): void{
    setImageFile(null)
    setImagePreview("")
  }


  async function submitPost(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    // the data will be passed to req body
    const data = new FormData();
    data.append("content", textContent);

    if (imageFile) {
      data.append("image", imageFile);
    }
    try {
      const newPost = await createPost({postData: data, token}).unwrap()
      dispatch(addPost(newPost))
      clearForm()
    } catch (error) {
      console.error(error)
    }
  }

  function clearForm(): void {
    setTextContent("");
    setImagePreview("");
    setImageFile(null);
  }

  return (
    <div className="w-full max-w-[600px] h-auto">
      <form
        className="flex flex-col gap-3 h-auto p-4 bg-secondaryBg rounded-3xl"
        onSubmit={submitPost}
      >
        <div className="h-auto w-full flex flex-col gap-3">
          <div className="flex gap-2 items-center">
            <img
              src={user?.displayed_picture?.url}
              alt="user profile"
              className="h-[40px] w-[40px] rounded-full"
            />
            <h2 className="font-semibold text-sm text-white">
              {user?.username}
            </h2>
          </div>
          <textarea
            name="post"
            placeholder="Create a post..."
            className="h-auto outline-none text-white p-2 text-sm w-full overflow-hidden bg-matteBlack rounded-xl placeholder:text-[#4a4545]"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            
          />
          {imagePreview && (
            <div className="w-full relative">
              <p className="top-2 right-2 text-white text-[1.3rem] absolute p-1 rounded-full bg-[#3d3d3dad] hover:bg-[#4f4c4c] cursor-pointer" onClick={removeImage}>
                <IoMdClose />
              </p>
              <img src={imagePreview} alt="Preview" className="w-full rounded-xl" />
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="file-input"
            className="cursor-pointer text-lightText hover:text-[#636060c4] text-[1.5rem]"
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
            className="bg-cta p-2 font-normal rounded-xl text-xs"
            disabled={false}
            type="submit"
          >
            Create post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;
