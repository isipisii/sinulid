import { api } from "./api";
import { LogInCredentials, SignUpCredentials, User } from "../types/types";

type UpdateUserProfileInfo = {
    newUserInfo: FormData;
    token: string;
}

type TokenType = {
    token: string
}

//wasnt able to use prepareHeaders since some endpoint dont require headers
const authAndUserApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAuthenticatedUser: builder.mutation<User, string>({
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
    }),
})

export const { useGetAuthenticatedUserMutation , useLogInMutation, useSignUpMutation, useUpdateUserProfileMutation, useLazyGetUserInfoQuery} = authAndUserApi