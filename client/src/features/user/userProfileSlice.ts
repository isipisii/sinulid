import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { User, Post } from "../../types/types";

interface IUserProfileState {
    userProfileInfo: User | null
    userPosts: Post[]
    toEditUserInfo: User | null
}

const initialState: IUserProfileState = {
    userProfileInfo: null,
    userPosts: [],
    toEditUserInfo: null
}

export const userProfileSlice = createSlice({
    name: "userProfile",
    initialState,
    reducers: {
        setUserProfileInfo: (state, action: PayloadAction<User>) => {
            state.userProfileInfo = action.payload
        },
        setUserPosts: (state, action: PayloadAction<Post[]>) => {
            state.userPosts = action.payload
        },
        setToEditUserInfo:(state, action: PayloadAction<User | null>) => {
            state.toEditUserInfo = action.payload
        },
        likePostInUserProfile: (state, action: PayloadAction<{ postId: string; user: User }>) => {
            state.userPosts = state.userPosts.map(post => {
                if (post._id === action.payload.postId) {
                return {
                    ...post,
                    liked_by: [...post.liked_by, action.payload.user],
                    likes: post.likes + 1,
                    };
                }
                return post;
            });
        },
        unlikePostInUserProfile: (state, action: PayloadAction<{ postId: string; user: User }>) => {
            state.userPosts = state.userPosts.map(post => {
                if (post._id === action.payload.postId) {
                return {
                    ...post,
                    liked_by: post.liked_by.filter(user => user._id !== action.payload.user._id),
                    likes: post.likes - 1
                    };
                }
                return post;
            });
        },
        updatePostInUserProfile: (state, action: PayloadAction<Post>) => {
            state.userPosts = state.userPosts.map(post => post._id === action.payload._id ? {...action.payload} : post)
        },
        deletePostInUserProfile: (state, action: PayloadAction<string>) => {
            state.userPosts = state.userPosts.filter(post => post._id !== action.payload)
        },
         // update the creator in a certain post when the user edited his/her info 
        updateUserInPost: (state, action: PayloadAction<User>) => {
            state.userPosts = state.userPosts.map(post => ({...post, creator: action.payload }))
        }
    }
})

export const { setUserProfileInfo, setUserPosts, deletePostInUserProfile, updatePostInUserProfile, likePostInUserProfile, unlikePostInUserProfile, setToEditUserInfo, updateUserInPost} = userProfileSlice.actions

export default userProfileSlice
