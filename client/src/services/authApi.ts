import { api } from "./api";
import { LogInCredentials, SignUpCredentials, User, UpdateUserInfo } from "../types/types";

type UpdateUserProfileInfo = {
    updateUserInfo: UpdateUserInfo;
    token: string;
}

type TokenType = {
    token: string
}
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
            query: ({ updateUserInfo, token }) => ({
                url: "/users/update",
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: updateUserInfo
            })
        })

    }),
})

export const { useGetAuthenticatedUserMutation , useLogInMutation, useSignUpMutation, useUpdateUserProfileMutation} = authAndUserApi