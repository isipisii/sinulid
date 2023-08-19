import { FC, useEffect, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import Activity from "./pages/Activity";
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const PostAndReplies = lazy(() => import("./pages/PostAndRepliesPage"));
const CreateReplyPage = lazy(() => import("./pages/CreateReplyPage"));
import SearchUserPage from "./pages/SearchUserPage";

import AllActivity from "./components/outlets/AllActivity";
import FollowsActivity from "./components/outlets/FollowsActivity";
import LikesActivity from "./components/outlets/LikesActivity";
import RepliesActivity from "./components/outlets/RepliesActivity";

import NavBar from "./components/NavBar";
import UserReplies from "./components/outlets/UserReplies";
import ScrollToTop from "./components/hoc/ScrollToTop";

import { useLazyGetAuthenticatedUserQuery } from "./services/authAndUserApi";
import { useAppSelector, useAppDispatch } from "./features/app/hooks";
import { setUser } from "./features/auth/authSlice";
import Protected from "./components/hoc/Protected";

const ViewImageModal = lazy(() => import("./components/modals/ViewImageModal"));
const EditPostModal = lazy(() => import("./components/modals/EditPostModal"));
import SideBarAndBottomNav from "./components/SideBarAndBottomNav";
import NotFound from "./pages/NotFound";

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if(error.status === 401){
        localStorage.removeItem("token")
      } else console.error(error);
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
      <Suspense fallback={<div>Loading...</div>}>
        <ViewImageModal />
        <EditPostModal />
      </Suspense>
      <Routes>
        <Route
          path="/"
          element={
            <ScrollToTop>
              <Protected isSignedIn={token}>
                <Suspense fallback={<div>Loading...</div>}>
                  <Home getUserInfo={getUserInfo} />
                </Suspense>
              </Protected>
            </ScrollToTop>
          }
        />
        <Route
          path="/create-reply/:postToReplyId"
          element={
            <ScrollToTop>
              <Protected isSignedIn={token}>
                <Suspense fallback={<div>Loading...</div>}>
                  <CreateReplyPage />
                </Suspense>
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
        >
          <Route path="all" element={<AllActivity />} />
          <Route path="follows" element={<FollowsActivity />} />
          <Route path="replies" element={<RepliesActivity />} />
          <Route path="likes" element={<LikesActivity />} />
        </Route>

        <Route
          path="/search"
          element={
            <ScrollToTop>
              <Protected isSignedIn={token}>
                <SearchUserPage />
              </Protected>
            </ScrollToTop>
          }
        />
        <Route path="/profile/:username" element={
          <Suspense>
              <Profile />
          </Suspense>
        }>
          <Route
            path="replies"
            element={
            <UserReplies userProfileInfo={userProfileInfo} />}
          />
        </Route>


        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/:username/post/:postId"
          element={
            <ScrollToTop>
              <Suspense>
                <PostAndReplies />
              </Suspense>
            </ScrollToTop>
          }
        />
        {/* TODO */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
