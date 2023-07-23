import { FC } from "react";
import { LogInCredentials } from "../types/types";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../features/app/hooks";
import { useLogInMutation } from "../services/authApi";
import { setToken } from "../features/auth/authSlice";
import { useForm } from 'react-hook-form';

const LogIn: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logIn] = useLogInMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<LogInCredentials>()
  const errorStyle = "text-red-500 text-[.7rem]"

  async function handleLogIn(logInCredentials: LogInCredentials): Promise<void> {
    try {
      const payload = await logIn(logInCredentials).unwrap();
      if (payload) {
        localStorage.setItem("token", payload.token);
        dispatch(setToken(payload.token));
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="h-[100vh] flex items-center justify-center bg-matteBlack">
      <form
        className="flex items-center justify-center flex-col gap-6 border border-borderColor p-5 rounded-md w-[400px]"
        onSubmit={handleSubmit(handleLogIn)}
      >
        <h1 className="text-white font-semibold text-[1.5rem] self-start">
          Log in to Sinulid
        </h1>
        <div className="flex justify-center flex-col gap-3 w-full">
          {/* email */}
          <input 
            placeholder='Email'
            type='email'
            className={`placeholder:text-[#726e6e] text-white block w-full border border-borderColor rounded-sm p-2 shadow-sm 
            focus:outline-none focus:border-none focus:ring-cta focus:ring-1 sm:text-sm bg-transparent ${errors.email ? "border-red-500 focus:ring-red-500" : null}`}
            {...register("email", {required: true})}
          />
          {errors.email && errors.email.type === "required"  && (<p className={errorStyle}>Email is required</p>)}

          {/* password */}
          <input 
            placeholder='Password'
            type='password'
            className={`placeholder:text-[#726e6e] text-white block w-full border border-borderColor rounded-sm p-2 shadow-sm 
            focus:outline-none focus:border-none focus:ring-cta focus:ring-1 sm:text-sm bg-transparent ${errors.password ? "border-red-500 focus:ring-red-500" : null}`}
            {...register("password", {required: true, minLength: 8})}
          />
          {errors.password && errors.password.type === "required"  && (<p className={errorStyle}>Password is required</p>)}
          {errors.password && errors.password.type === "minLength"  && (<p className={errorStyle}>Password should be more than 8 characters</p>)}
          
        </div>
        <button
          type="submit"
          className="bg-cta w-full p-2 rounded-sm text-matteBlack font-bold text-sm"
        >
          Log in
        </button>
        <p className="text-lightText text-xs">
          Don't have an account?{" "}
          <Link to="/signup" className="text-cta">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LogIn;
