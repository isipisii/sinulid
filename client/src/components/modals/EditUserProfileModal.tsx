import { JSX, useState, ChangeEvent, FormEvent } from "react";
import { IoMdClose } from "react-icons/io";
import { FaUserPen } from "react-icons/fa6"
import { useAppSelector, useAppDispatch } from "../../features/app/hooks";
import { setToEditUserInfo, setUserProfileInfo, updateUserInPost } from "../../features/user/userProfileSlice";
import { useUpdateUserProfileMutation } from "../../services/authAndUserApi";
import { setUser } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { showToast } from "../../util/showToast";
import Spinner from "../loader/Spinner";

type EditUserInfo = {
    name?: string
    username?: string
    bio?: string
    link?: string
}

const EditUserProfileModal = (): JSX.Element => {
    const dispatch = useAppDispatch()
    const [updateUserProfileMutation,  { isLoading }] = useUpdateUserProfileMutation()
    const { token } = useAppSelector(state => state.auth)
    const { toEditUserInfo, userDefaultProfileImage } = useAppSelector(state => state.userProfile)
    const [userInfo, setUserInfo] = useState<EditUserInfo | null>({
        name: toEditUserInfo?.name, 
        username: toEditUserInfo?.username,
        bio: toEditUserInfo?.bio,
        link: toEditUserInfo?.link 
    })
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>(toEditUserInfo?.displayed_picture?.url || "");
    const navigate = useNavigate()

    function handleOnchange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void{
        const {name, value} = event.target
        setUserInfo(prevState => ({
            ...prevState,
            [name]: value
        }))
    }
    
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
    
    function clearFormAndCloseModal(){
        setImagePreview("")
        setUserInfo(null)
        dispatch(setToEditUserInfo(null))
    }

    function isLinkValid(link: string): boolean{
        const linkRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*([?][^\s]*)?([/][^\s]*)?$/;
        
        return linkRegex.test(link)
    }

    async function handleUpdateUserInfo(e: FormEvent<HTMLFormElement>): Promise<void>{
        e.preventDefault();
        const data = new FormData();

        for (const key in userInfo) {
            if (userInfo.hasOwnProperty.call(userInfo, key)) {
                const value = userInfo[key as keyof EditUserInfo];
                if(value) data.append(key, value)
            }
        }

        if(imageFile) data.append("image", imageFile);

        try {
            if(userInfo?.link && !isLinkValid(userInfo?.link)) {
                showToast("The link you provided is invalid", true)
                return
            }

            const updatedUserInfo = await updateUserProfileMutation({ newUserInfo: data, token }).unwrap()

            // update the states
            if(updatedUserInfo){
                dispatch(setUserProfileInfo(updatedUserInfo))
                dispatch(setUser(updatedUserInfo))
                dispatch(updateUserInPost(updatedUserInfo))
                // updates the url of the user profile
                navigate(`/profile/${updatedUserInfo.username}`);
                clearFormAndCloseModal()
                showToast("Profile updated successfully")
            }
        } catch (error) {
            console.error(error)
            showToast("Error, something went wrong", true)
        }
    }

    return (
        <div className="bg-[#000000bd] backdrop-blur-sm fixed w-[100vw] h-[100vh] z-20 top-0 left-0 flex items-center justify-center">
            {/* close icon */}
            <p className="top-5 right-5 text-[#525151] text-[1.2rem] md:text-[1.5rem] absolute p-2 md:p-3 font-thin rounded-full bg-[#252424ce] hover:bg-[#424141ba] cursor-pointer" onClick={clearFormAndCloseModal}>
                <IoMdClose />
            </p>
            <div className="w-[90%] max-w-[600px] h-auto bg-matteBlack mt-8 md:mt-0 rounded-md border-borderColor border p-4">
                <h2 className="text-center text-white font-medium mb-4">Edit profile</h2>
                <form action="" className="flex w-full flex-col gap-4 h-full" onSubmit={handleUpdateUserInfo}>
                    <div className="flex justify-between items-end">
                        <div className="w-[70%] md:w-[80%] flex flex-col outline-none">
                            <label className="text-white text-xs md:text-sm">Name</label>
                            <input 
                                value={userInfo?.name} 
                                name="name" 
                                type="text" 
                                placeholder="Provide your name" 
                                className="bg-transparent border-[#3b39397e] border-b p-2 placeholder:text-[#4a4545] text-xs md:text-sm text-white focus:border-white focus:outline-none" 
                                onChange={handleOnchange}
                            />
                        </div>
                        {/* displayed pic preview and upload */}
                        <div className="h-[60px] w-[60px] md:h-[80px] md:w-[80px] relative rounded-full ">
                            
                            <label
                                htmlFor="file-input"
                            >   
                                <div className="flex opacity-0 hover:opacity-100 hover:bg-[#1715153c] w-full cursor-pointer rounded-full h-full absolute top-0 left-0 ease-in-out duration-300 items-center justify-center">
                                    <p className="text-[#fff] text-[1.4rem] ml-1"><FaUserPen/></p>
                                </div>
                                <img src={imagePreview ? imagePreview : userDefaultProfileImage} alt="profile pic" className="rounded-full h-[60px] w-[60px] md:h-[80px] md:w-[80px] object-cover"/>
                            </label>
                            <input
                                id="file-input"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleSelectedFiles(e.target.files)}
                                className="hidden"
                            />
                        </div>     
                        {/*end of displayed pic preview and upload */} 
                    </div>
                    <div className="w-full flex flex-col outline-none">
                        <label className="text-white text-xs md:text-sm">Username</label>
                        <input 
                            value={userInfo?.username} 
                            name="username" 
                            type="text" 
                            placeholder="Provide username" 
                            className="bg-transparent border-[#3b39397e] border-b p-2 placeholder:text-[#4a4545] text-xs md:text-sm text-white focus:border-white focus:outline-none" 
                            onChange={handleOnchange}
                        />
                    </div>
                    <div className="w-full flex flex-col outline-none">
                        <label className="text-white text-xs md:text-sm">Bio</label>
                        <textarea 
                            value={userInfo?.bio} 
                            name="bio" 
                            placeholder="Write bio" 
                            rows={1} 
                            className="bg-transparent max-h-[100px] md:max-h-[150px] border-[#3b39397e] border-b p-2 placeholder:text-[#4a4545] text-xs md:text-sm text-white focus:border-white focus:outline-none" 
                            onChange={handleOnchange}
                        />
                    </div>
                    <div className="w-full flex flex-col outline-none">
                        <label className="text-white text-xs md:text-sm">Link</label>
                        <input 
                            value={userInfo?.link} 
                            name="link" 
                            type="text" 
                            placeholder="Add link" 
                            className="bg-transparent border-[#3b39397e] border-b p-2 placeholder:text-[#4a4545] text-xs md:text-sm text-white focus:border-white focus:outline-none" 
                            onChange={handleOnchange}
                        />
                    </div>
                    <button className="bg-white hover:bg-[#e5e2e2bd] ease-in-out duration-300 py-2 rounded-md text-xs md:text-sm font-medium flex gap-1 justify-center items-center">{isLoading ? "Saving" : "Save"} {isLoading &&  <Spinner fillColor="fill-black" pathColor="text-gray-400" />}</button>
                </form>
            </div>
            {/* toast notification */}
            <Toaster position="bottom-center" reverseOrder={false}/>
        </div>
    );
};

export default EditUserProfileModal;
