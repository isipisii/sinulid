import { FC, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
// import UserPostsAndReposts from "./pages/UserPostsAndReposts";
import UserReplies from "./pages/UserReplies";

import { useLazyGetAuthenticatedUserQuery } from "./services/authAndUserApi";
import { useAppSelector, useAppDispatch } from "./features/app/hooks";
import { setUser } from "./features/auth/authSlice";
import Protected from "./components/Protected";

import ViewImageModal from "./components/modals/ViewImageModal";
import SideBarAndBottomNav from "./components/SideBarAndBottomNav";
import Activity from "./pages/Activity";
import Profile from "./pages/Profile";
import EditPostModal from "./components/modals/EditPostModal";
import PostAndReplies from "./pages/PostAndReplies";

const App: FC = () => {
  const { token } = useAppSelector((state) => state.auth);
  const { userProfileInfo } = useAppSelector((state) => state.userProfile)
  const dispatch = useAppDispatch();
  const [getAuthenticatedUserInfo] = useLazyGetAuthenticatedUserQuery()

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

  useEffect(() => {
    getUserInfo()
  },[])

  return (
    <>
      <NavBar />
      <SideBarAndBottomNav />
      <ViewImageModal />
      <EditPostModal />
      <Routes>
        <Route
          path="/"
          element={
            <Protected isSignedIn={token}>
              <Home getUserInfo={getUserInfo}/>
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
        <Route path="/profile/:username" element={<Profile />}>
          <Route path="replies" element={<UserReplies userProfileInfo={userProfileInfo} />} />
        </Route>
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/:username/post/:postId" element={<PostAndReplies />} />
        {/* TODO */}
        {/* <Route path="*" element={<NotFound />} /> */} 
      </Routes>
    </>
  );
};

export default App;
