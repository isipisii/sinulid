import { FC, useState, ChangeEvent, FormEvent } from "react";
import { LogInCredentials } from "../types/types";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../features/app/hooks";
import { useLogInMutation } from "../services/authApi";
import { setToken } from "../features/auth/authSlice";
import { logInFields } from "../constants";

const LogIn: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logIn] = useLogInMutation();
  const [logInCredentials, setLogInCredentials] = useState<LogInCredentials>({
    email: "",
    password: "",
  });

  function handleOnChange(e: ChangeEvent  <HTMLInputElement>) {
    const { name, value } = e.target;
    setLogInCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function handleLogIn(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

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
        className="flex items-center justify-center flex-col gap-6 border border-slate-600 p-5 rounded-md w-[400px]"
        onSubmit={handleLogIn}
      >
        <h1 className="text-white font-semibold text-[1.5rem] self-start">
          Log in to Sinulid
        </h1>
        <div className="flex items-center justify-center flex-col gap-3 w-full">
          {logInFields.map((field, index) => (
            <input
              name={field.inputName}
              onFocus={(e) => (e.target.style.borderColor = "#ffffff81")}
              type={field.inputType}
              placeholder={field.placeholder}
              className=" placeholder:text-[#726e6e] text-white block w-full border border-[#d3d3d354] rounded-sm p-2 shadow-sm 
              focus:outline-none focus:border-none focus:ring-cta focus:ring-1 sm:text-sm bg-transparent"
              onChange={handleOnChange}
              key={index}
            />
          ))}
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
