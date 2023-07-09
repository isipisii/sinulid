import { FC, useState, ChangeEvent, FormEvent } from "react";
import { LogInCredentials } from "../types/types";

const LogIn: FC = () => {
  const [logInCredentials, setLogInCredentials] = useState<LogInCredentials>({
    email: "",
    password: "",
  });

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setLogInCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function handleLogIn(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/users/log-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logInCredentials)
        })

      const data = await response.json()
      localStorage.setItem("token", data.token)
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div className="h-[100vh] flex items-center justify-center">
      <form
        className="flex items-center justify-center flex-col auto gap-4 border border-slate-600 p-5"
        onSubmit={handleLogIn}
      >
        <label htmlFor="email">Email</label>
        <input
          name="email"
          type="email"
          id="email"
          className="border"
          onChange={handleOnChange}
        />

        <label htmlFor="password">Password</label>
        <input
          name="password"
          type="password"
          id="password"
          className="border"
          onChange={handleOnChange}
        />

        <button type="submit">Log in</button>
      </form>
    </div>
  );
};

export default LogIn;
