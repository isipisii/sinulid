import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { User, Post, Repost, ItemType } from "../../types/types";

interface IUserProfileState {
    userProfileInfo: User | null
    userPostsAndReposts: (Post | Repost) []
    toEditUserInfo: User | null
    userReposts: Repost[]
    userDefaultProfileImage: string
    otherUserPostsAndReposts: (Post | Repost) []
    users: User[]
    searchedUsers: User[]
}

const initialState: IUserProfileState = {
    userProfileInfo: null,
    userPostsAndReposts: [],
    otherUserPostsAndReposts: [],
    toEditUserInfo: null,
    userReposts: [],
    userDefaultProfileImage: "https://img.myloview.com/posters/default-avatar-profile-icon-vector-social-media-user-photo-700-205577532.jpg",
    users: [],
    searchedUsers: []
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
        setOtherUserPostsAndReposts: (state, action: PayloadAction<(Post | Repost)[]>) => {
            state.otherUserPostsAndReposts = action.payload
        },
        setToEditUserInfo:(state, action: PayloadAction<User | null>) => {
            state.toEditUserInfo = action.payload
        },
        likePostOrRepostInUserProfile: (state, action: PayloadAction<{ postId: string; user: User }>) => {
            state.userPostsAndReposts = state.userPostsAndReposts.map(item => {
                if (item.type === ItemType.Post) {
                    const post = item as Post;
                    if (post._id === action.payload.postId) {
                        return {
                            ...post,
                            liked_by: [...post.liked_by, action.payload.user],
                            likes: post.likes + 1,
                        };
                    }
                } else if (item.type === ItemType.Repost) {
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

            state.otherUserPostsAndReposts = state.otherUserPostsAndReposts.map(item => {
                if (item.type === ItemType.Post) {
                    const post = item as Post;
                    if (post._id === action.payload.postId) {
                        return {
                            ...post,
                            liked_by: [...post.liked_by, action.payload.user],
                            likes: post.likes + 1,
                        };
                    }
                } else if (item.type === ItemType.Repost) {
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
                if (item.type === ItemType.Post) {
                    const post = item as Post;
                    if (post._id === action.payload.postId) {
                        return {
                            ...post,
                            liked_by: post.liked_by.filter(user => user._id !== action.payload.user._id),
                            likes: post.likes - 1,
                        };
                    }
                } else if (item.type === ItemType.Repost) {
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

            state.otherUserPostsAndReposts = state.otherUserPostsAndReposts.map(item => {
                if (item.type === ItemType.Post) {
                    const post = item as Post;
                    if (post._id === action.payload.postId) {
                        return {
                            ...post,
                            liked_by: post.liked_by.filter(user => user._id !== action.payload.user._id),
                            likes: post.likes - 1,
                        };
                    }
                } else if (item.type === ItemType.Repost) {
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
                if(item.type === ItemType.Post){
                    const post = item as Post
                    if(post._id === action.payload._id){
                        return {
                            ...action.payload
                        }
                    }
                } else if(item.type === ItemType.Repost){
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
        },
        deletePostOrRepostInUserProfile: (state, action: PayloadAction<{postId?: string, repostId?: string}>) => {
            state.userPostsAndReposts = state.userPostsAndReposts.filter(item => {
                if(item.type === ItemType.Post){
                    const post = item as Post
                    return  post._id !== action.payload.postId
                } 
                else if (item.type === ItemType.Repost && action.payload.repostId){
                    const repost = item as Repost 
                    return repost._id !== action.payload.repostId && repost.post._id !== action.payload.postId
                }
            })
        },
         // update the creator in a certain post when the user edited his/her info 
        updateUserInPost: (state, action: PayloadAction<User>) => {
            state.userPostsAndReposts = state.userPostsAndReposts.map(item => {
                if(item.type === ItemType.Post){
                    const post = item as Post
                    return {
                        ...post,
                        creator: action.payload
                    }
                } else if (item.type === ItemType.Repost){
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
        },
        setUserReposts: (state, action: PayloadAction<Repost[]>) => {
            state.userReposts = action.payload
        },
        setUsers: (state, action: PayloadAction<User[]>) => {
            state.users = action.payload
        },
        setSearchedUsers: (state, action: PayloadAction<User[]>) => {
            state.searchedUsers = action.payload
        },
        followRandomUser: (state, action: PayloadAction<{userTofollowId: string, authenticatedUser: User}>) => {

            state.users = state.users.map((randomUser) => {
                if(randomUser._id === action.payload.userTofollowId){
                    return{
                        ...randomUser,
                        followers: [...randomUser.followers, action.payload.authenticatedUser]
                    }
                }
                return randomUser
            })
        },
        unfollowRandomUser: (state, action: PayloadAction<{userTofollowId: string, authenticatedUser: User}>) => {

            state.users = state.users.map((randomUser) => {
                if(randomUser._id === action.payload.userTofollowId){
                    return{
                        ...randomUser,
                        followers: randomUser.followers.filter((follower) => follower._id !== action.payload.authenticatedUser._id)
                    }
                }
                return randomUser
            })
        },

        followSearchedUser: (state, action: PayloadAction<{userTofollowId: string, authenticatedUser: User}>) => {

            state.searchedUsers = state.searchedUsers.map((searchedUser) => {
                if(searchedUser._id === action.payload.userTofollowId){
                    return{
                        ...searchedUser,
                        followers: [...searchedUser.followers, action.payload.authenticatedUser]
                    }
                }
                return searchedUser
            })
        },
        unfollowSearchedUser: (state, action: PayloadAction<{userTofollowId: string, authenticatedUser: User}>) => {

            state.searchedUsers = state.searchedUsers.map((searchedUser) => {
                if(searchedUser._id === action.payload.userTofollowId){
                    return{
                        ...searchedUser,
                        followers: searchedUser.followers.filter((follower) => follower._id !== action.payload.authenticatedUser._id)
                    }
                }
                return searchedUser
            })
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
    addRepostInUserProfile,
    setUserReposts,
    setOtherUserPostsAndReposts,
    setUsers,
    setSearchedUsers,
    followSearchedUser,
    unfollowSearchedUser,
    followRandomUser,
    unfollowRandomUser
} = userProfileSlice.actions

export default userProfileSlice
