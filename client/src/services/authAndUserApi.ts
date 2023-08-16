import { api } from "./api";
import { LogInCredentials, Repost, SignUpCredentials, User, Post } from "../types/types";

type UpdateUserProfileInfo = {
    newUserInfo: FormData;
    token: string;
}

type TokenType = {
    token: string
}

type FollowAndUnfollow = {
    token: string
    userToFollowId: string
}


//wasnt able to use prepareHeaders since some endpoint dont require headers
const authAndUserApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAuthenticatedUser: builder.query<User, string>({
            query: (token) => ({
                url: "/users",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
        }),
        logIn: builder.mutation<TokenType, LogInCredentials>({
            query: (loginCredentials) => ({
                url: "/users/login",
                method: "POST",
                body: loginCredentials,
            })
        }),
        signUp: builder.mutation<TokenType, SignUpCredentials>({
            query: (signUpCredentials) => ({
                url: "/users/signup",
                method: "POST",
                body: signUpCredentials,
            })
        }),
        updateUserProfile: builder.mutation<User, UpdateUserProfileInfo>({
            query: ({ newUserInfo, token }) => ({
                url: "/users/update",
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: newUserInfo
            })
        }),
        getUserInfo: builder.query<User, string>({
            query: (username) => `/users/${username}`
        }),
        followUser: builder.mutation<void, FollowAndUnfollow>({
            query: ({ token, userToFollowId }) => ({
                url: `/users/follow/${userToFollowId}`,
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }),
            invalidatesTags: ["Users"]
        }),
        unfollowUser: builder.mutation<void, FollowAndUnfollow>({
            query: ({ token, userToFollowId }) => ({
                url: `/users/unfollow/${userToFollowId}`,
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }),
            invalidatesTags: ["Users"]
        }),
        getUserPostsAndReposts: builder.query<(Post | Repost)[],string>({
            query:(userId) =>  `/users/${userId}/posts-and-reposts`
        }),
        getUserReplies: builder.query<Post[], string>({
           query:(userId) => `/posts/user-replies/${userId}`,
        }),
        getSearchedUsers: builder.query<User[], string>({
            query:(username) => `/users/search/${username}`,
        }),
        getUsers: builder.query<User[], string>({
            query:(token) => ({
                url:  "/users/all",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }),
            providesTags: (result) =>
            result
              ? [...result.map(({ _id }) => ({ type: "Users" as const, _id })), "Users"]
              : ["Users"],
        }),
    }),
})

export const { 
    useLazyGetAuthenticatedUserQuery, 
    useLogInMutation, 
    useSignUpMutation, 
    useUpdateUserProfileMutation, 
    useLazyGetUserInfoQuery, 
    useFollowUserMutation, 
    useUnfollowUserMutation,
    useLazyGetUserPostsAndRepostsQuery,
    useLazyGetUserRepliesQuery,
    useLazyGetSearchedUsersQuery,
    useGetUsersQuery,
} = authAndUserApi