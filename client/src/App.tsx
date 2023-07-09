import { FC, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import SignUp from "./pages/SignUp"
import LogIn from "./pages/LogIn"
import Feed from "./pages/Feed"
// import Protected from "./components/Protected"
import { useAppSelector, useAppDispatch } from "./features/app/hooks"
import { User } from "./types/types"
import { getUser } from "./features/auth/authSlice"
import Protected from "./components/Protected"

const App: FC = () => {
  const { token, user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

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
      dispatch(getUser(data))
    } catch (error) {
      console.error
    }
}

  useEffect(() => {
    if (!user) {
      getUserInfo();
  }
  }, [user])

  return (
    <Routes>
      <Route path="/login" element={<LogIn />} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/" element={
        <Protected isSignedIn={user}>
            <Feed />
        </Protected>} 
      />
      
    </Routes>
  )
}

export default App