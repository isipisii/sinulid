import { FC } from "react"
import { Routes, Route } from "react-router-dom"
import SignUp from "./pages/SignUp"
import LogIn from "./pages/LogIn"
import Home from "./pages/Home"
import { useAppSelector, useAppDispatch } from "./features/app/hooks"
import { User } from "./types/types"
import { setUser } from "./features/auth/authSlice"
import Protected from "./components/Protected"

const App: FC = () => {
  const { token } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  // gets the user who logs in along with the token to authenticate 
  async function getUserInfo(): Promise<void> {
    try {
      const response = await fetch("http://localhost:5000/users/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      })
      const data: User = await response.json()
      dispatch(setUser(data))
      console.log(data)
    } catch (error) {
      console.error(error)
    }
}

  return (
    <Routes>
      <Route path="/" element={
        <Protected isSignedIn={token}>
            <Home getUserInfo={getUserInfo}/>
        </Protected>} 
      />
      <Route path="/login" element={<LogIn />} />
      <Route path="/signup" element={<SignUp/>} />
    </Routes>
  )
}

export default App