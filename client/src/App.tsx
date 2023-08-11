import { FC, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import UserReplies from "./pages/UserReplies";
import ScrollToTop from "./components/hoc/ScrollToTop";

import { useLazyGetAuthenticatedUserQuery } from "./services/authAndUserApi";
import { useAppSelector, useAppDispatch } from "./features/app/hooks";
import { setUser } from "./features/auth/authSlice";
import Protected from "./components/hoc/Protected";

import ViewImageModal from "./components/modals/ViewImageModal";
import SideBarAndBottomNav from "./components/SideBarAndBottomNav";
import Activity from "./pages/Activity";
import Profile from "./pages/Profile";
import EditPostModal from "./components/modals/EditPostModal";
import PostAndReplies from "./pages/PostAndRepliesPage";
import CreateReplyPage from "./pages/CreateReplyPage";

const App: FC = () => {
  const { token } = useAppSelector((state) => state.auth);
  const { userProfileInfo } = useAppSelector((state) => state.userProfile);
  const dispatch = useAppDispatch();
  const [getAuthenticatedUserInfo] = useLazyGetAuthenticatedUserQuery();

  // gets the user who logs in along with the token to authenticate
  async function getUserInfo(): Promise<void> {
    try {
      const authenticatedUser = await getAuthenticatedUserInfo(token).unwrap();

      if (authenticatedUser) {
        dispatch(setUser(authenticatedUser));
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <NavBar />
      <SideBarAndBottomNav />
      <ViewImageModal />
      <EditPostModal />
      {/* Wrap ScrollToTop around routes where you want scroll behavior */}
      <Routes>
        <Route
          path="/"
          element={
            <ScrollToTop>
              <Protected isSignedIn={token}>
                <Home getUserInfo={getUserInfo} />
              </Protected>
            </ScrollToTop>
          }
        />
        <Route
          path="/create-reply/:postToReplyId"
          element={
            <ScrollToTop>
              <Protected isSignedIn={token}>
                <CreateReplyPage />
              </Protected>
            </ScrollToTop>
          }
        />
        <Route
          path="/activity"
          element={
            <ScrollToTop>
              <Protected isSignedIn={token}>
                <Activity />
              </Protected>
            </ScrollToTop>
          }
        />
        <Route path="/profile/:username" element={<Profile />}>
          <Route
            path="replies"
            element={<UserReplies userProfileInfo={userProfileInfo} />}
          />
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
