import { FC } from "react";
import { Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import { useGetAuthenticatedUserMutation } from "./services/authApi";
import { useAppSelector, useAppDispatch } from "./features/app/hooks";
import { setUser } from "./features/auth/authSlice";
import Protected from "./components/Protected";
import ViewImageModal from "./components/modals/ViewImageModal";
import SideBarAndBottomNav from "./components/SideBarAndBottomNav";
import Activity from "./pages/Activity";
import Profile from "./pages/Profile";

const App: FC = () => {
  const { token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [getAuthenticatedUserInfo] = useGetAuthenticatedUserMutation()

  // gets the user who logs in along with the token to authenticate
  async function getUserInfo(): Promise<void> {
    try {
      const authenticatedUser = await getAuthenticatedUserInfo(token).unwrap()

      if(authenticatedUser){
        dispatch(setUser(authenticatedUser))
      }
    } catch (error) {
      console.error(error)
    } 
  }

  return (
    <>
      <NavBar />
      <SideBarAndBottomNav />
      <ViewImageModal />
      <Routes>
        <Route
          path="/"
          element={
            <Protected isSignedIn={token}>
              <Home getUserInfo={getUserInfo} />
            </Protected>
          }
        />
        <Route
          path="/activity"
          element={
            <Protected isSignedIn={token}>
              <Activity />
            </Protected>
          }
        />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
};

export default App;
