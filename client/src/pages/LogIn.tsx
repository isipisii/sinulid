import { JSX, useState } from "react";
import { LogInCredentials } from "../types/types";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../features/app/hooks";
import { useLogInMutation } from "../services/authAndUserApi";
import { setToken } from "../features/auth/authSlice";
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff } from 'react-icons/fi'
import Spinner from "../components/loader/Spinner";
import { showToast } from "../util/showToast";
import { Toaster } from "react-hot-toast";

const LogIn = (): JSX.Element => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logIn, { isLoading: isLoggingIn }] = useLogInMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<LogInCredentials>()
  const errorStyle = "text-red-500 text-[.7rem] mt-[-.5rem]"

  async function handleLogIn(logInCredentials: LogInCredentials): Promise<void> {
    try {
      const payload = await logIn(logInCredentials).unwrap();
      if (payload) {
        localStorage.setItem("token", payload.token);
        dispatch(setToken(payload.token));
        navigate("/");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if(error.status === 401){
        showToast("The username or password you are trying to log in with are incorrect", true);
      } else {
        console.error(error);
        showToast("Error, something went wrong.", true);
      } 
    }
  }

  return (
    <div className='h-[100vh] flex items-center justify-center bg-matteBlack bg-threads-bg bg-cover bg-center'>
      <form
        className="flex items-center justify-center flex-col gap-6 border bg-matteBlack border-borderColor p-5 mx-4 rounded-md w-[400px]"
        onSubmit={handleSubmit(handleLogIn)}
      >
        <h1 className="text-white font-semibold text-[1.5rem] self-start">
          <span className="font-light text-lightText">Log in to</span> <span className='gradient'> Threads </span>
        </h1>
        <div className="flex flex-col gap-3 w-full">
          {/* email */}
          <input 
            placeholder='Email'
            type='email'
            className={`placeholder:text-[#726e6e] text-white block w-full border border-borderColor rounded-sm p-2 shadow-sm 
            focus:outline-none focus:border-none focus:ring-1 sm:text-sm bg-transparent ${errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-white"}`}
            {...register("email", {required: true})}
          />
          {errors.email && errors.email.type === "required"  && (<p className={errorStyle}>Email is required</p>)}

          {/* password */}
          <div className="relative">
            <input 
              placeholder='Password'
              type={showPassword ? "text" : "password"}
              className={`placeholder:text-[#726e6e] text-white block w-full border border-borderColor rounded-sm p-2 pr-10 shadow-sm 
              focus:outline-none focus:border-non focus:ring-1 sm:text-sm bg-transparent ${errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-white"}`}
              {...register("password", {required: true, minLength: 8})}
            />
            {showPassword ? 
              <FiEyeOff className="absolute top-0 bottom-0 right-3 my-auto text-lightText text-[1rem] cursor-pointer" onClick={() => setShowPassword(false)} />  
                  : 
              <FiEye className="absolute top-0 bottom-0 right-3 my-auto text-lightText text-[1rem] cursor-pointer" onClick={() => setShowPassword(true)}/>
            }
          </div>
          {errors.password && errors.password.type === "required"  && (<p className={errorStyle}>Password is required</p>)}
          {errors.password && errors.password.type === "minLength"  && (<p className={errorStyle}>Password should be more than 8 characters</p>)}
          
        </div>
        <button
          type="submit"
          className="bg-white hover:bg-[#e5e2e2bd] ease-in-out duration-300 w-full p-2 rounded-sm text-matteBlack font-bold text-sm flex items-center justify-center"
        > 
          <div className="flex items-center gap-2">
            {isLoggingIn ? "Logging in" : "Log in"}
            {isLoggingIn && <Spinner fillColor="fill-black" pathColor="text-gray-400" />}
          </div>
        </button>
        <p className="text-lightText text-xs">
          Don't have an account?{" "}
          <Link to="/signup" className="text-white">
            Sign up
          </Link>
        </p>
      </form>
      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
};

export default LogIn;
 