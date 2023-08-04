import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { User, Post, Repost } from "../../types/types";

interface IUserProfileState {
    userProfileInfo: User | null
    userPostsAndReposts: (Post | Repost) []
    toEditUserInfo: User | null
}

const initialState: IUserProfileState = {
    userProfileInfo: null,
    userPostsAndReposts: [],
    toEditUserInfo: null
}

export const userProfileSlice = createSlice({
    name: "userProfile",
    initialState,
    reducers: {
        setUserProfileInfo: (state, action: PayloadAction<User>) => {
            state.userProfileInfo = action.payload
        },
        setUserPostsAndReposts: (state, action: PayloadAction<(Post | Repost)[]>) => {
            state.userPostsAndReposts = action.payload
        },
        setToEditUserInfo:(state, action: PayloadAction<User | null>) => {
            state.toEditUserInfo = action.payload
        },
        likePostOrRepostInUserProfile: (state, action: PayloadAction<{ postId: string; user: User }>) => {
            state.userPostsAndReposts = state.userPostsAndReposts.map(item => {
                if (item.type === "post") {
                    const post = item as Post;
                    if (post._id === action.payload.postId) {
                        return {
                            ...post,
                            liked_by: [...post.liked_by, action.payload.user],
                            likes: post.likes + 1,
                        };
                    }
                } else if (item.type === "repost") {
                    const repost = item as Repost;
                    if (repost.post._id === action.payload.postId) {
                        return {
                            ...repost,
                            post: {
                                ...repost.post,
                                liked_by: [...repost.post.liked_by, action.payload.user],
                                likes: repost.post.likes + 1,
                            }
                        };
                    }
                }
                return item;
            });
        },
        unlikePostOrRepostInUserProfile: (state, action: PayloadAction<{ postId: string; user: User }>) => {
            state.userPostsAndReposts = state.userPostsAndReposts.map(item => {
                if (item.type === "post") {
                    const post = item as Post;
                    if (post._id === action.payload.postId) {
                        return {
                            ...post,
                            liked_by: post.liked_by.filter(user => user._id !== action.payload.user._id),
                            likes: post.likes - 1,
                        };
                    }
                } else if (item.type === "repost") {
                    const repost = item as Repost;
                    if (repost.post._id === action.payload.postId) {
                        return {
                            ...repost,
                            post: {
                                ...repost.post,
                                liked_by: repost.post.liked_by.filter(user => user._id !== action.payload.user._id),
                                likes: repost.post.likes - 1,
                            }
                        };
                    }
                }
                return item;
            });
        },
        updatePostOrRepostInUserProfile: (state, action: PayloadAction<Post>) => {
            state.userPostsAndReposts = state.userPostsAndReposts.map(item => {
                if(item.type === "post"){
                    const post = item as Post
                    if(post._id === action.payload._id){
                        return {
                            ...action.payload
                        }
                    }
                } else if(item.type === "repost"){
                    const repost = item as Repost

                    if(repost.post._id === action.payload._id){
                        return{
                            ...repost,
                            post: {
                                ...action.payload
                            }
                        }
                    }
                }
                return item
            })
            // state.userPosts = state.userPosts.map(post => post._id === action.payload._id ? {...action.payload} : post)
        },
        deletePostOrRepostInUserProfile: (state, action: PayloadAction<{postId?: string, repostId?: string}>) => {
            state.userPostsAndReposts = state.userPostsAndReposts.filter(item => {
                if(item.type === "post"){
                    const post = item as Post
                    return  post._id !== action.payload.postId
                } 
                else if (item.type === "repost" && action.payload.repostId){
                    const repost = item as Repost 
                    return repost._id !== action.payload.repostId && repost.post._id !== action.payload.postId
                }
            })
        },
         // update the creator in a certain post when the user edited his/her info 
        updateUserInPost: (state, action: PayloadAction<User>) => {
            state.userPostsAndReposts = state.userPostsAndReposts.map(item => {
                if(item.type === "post"){
                    const post = item as Post
                    return {
                        ...post,
                        creator: action.payload
                    }
                } else if (item._id === "repost"){
                    const repost = item as Repost
                    return {
                        ...repost,
                        post: {
                            ...repost.post,
                            creator: action.payload
                        }
                    }
                }
                return item
            })
        },
        followUser: (state, action: PayloadAction<User>) => {
            const isFollowing =  state.userProfileInfo?.followers.some((follower) => follower._id === action.payload._id)
            if(!state.userProfileInfo || isFollowing) return

            state.userProfileInfo = {...state.userProfileInfo, 
                followers: [...state.userProfileInfo.followers, action.payload],
                followerCount: state.userProfileInfo.followerCount + 1
            }
        },
        unfollowUser: (state, action: PayloadAction<User>) => {
            const isFollowing =  state.userProfileInfo?.followers.some((follower) => follower._id === action.payload._id)
            if(!state.userProfileInfo || !isFollowing) return
            
            state.userProfileInfo = {...state.userProfileInfo, 
                followers: state.userProfileInfo.followers.filter(follower => follower._id !== action.payload._id),
                followerCount: state.userProfileInfo.followerCount - 1
            }
        },
        addRepostInUserProfile: (state, action: PayloadAction<Repost>) => {
            state.userPostsAndReposts.unshift(action.payload)
        }
    }
})

export const { 
    setUserProfileInfo, 
    setUserPostsAndReposts, 
    deletePostOrRepostInUserProfile,
    updatePostOrRepostInUserProfile,
    likePostOrRepostInUserProfile, 
    unlikePostOrRepostInUserProfile,
    setToEditUserInfo, 
    updateUserInPost,
    followUser,
    unfollowUser,
    addRepostInUserProfile
} = userProfileSlice.actions

export default userProfileSlice
