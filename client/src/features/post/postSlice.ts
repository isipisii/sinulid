import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Post, User } from '../../types/types'

interface IPostState {
    posts: Post[]
    viewImage: string,
    postToEdit: Post | null
    post: Post | null
    replies: Post[]
    userReplies: Post[]
}

const initialState: IPostState = {
    posts: [], // posts inside the feed
    viewImage: "",
    postToEdit: null,
    post: null,
    replies: [],
    userReplies: []
}  

export const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        addPost: (state, action: PayloadAction<Post>) => {
            state.posts.unshift(action.payload) 
        },
        deletePost: (state, action: PayloadAction<string>) => {
            state.posts = state.posts.filter(post => post._id !== action.payload)
        },
        setPosts: (state, action: PayloadAction<Post[]>) => {
            state.posts = action.payload
        },
        likePost: (state, action: PayloadAction<{ postId: string; user: User }>) => {
            state.posts = state.posts.map(post => {
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
        unlikePost: (state, action: PayloadAction<{ postId: string; user: User }>) => {
            state.posts = state.posts.map(post => {
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
        setImageUrl: (state, action: PayloadAction<string>) => {
            state.viewImage = action.payload
        },
        setPostToEdit: (state, action: PayloadAction<Post | null>) => {
            state.postToEdit = action.payload
        },
        updatePost: (state, action: PayloadAction<Post>) => {
            state.posts = state.posts.map(post => post._id === action.payload._id ? action.payload : post)
        },
        setSinglePost: (state, action: PayloadAction<Post>) => {
            state.post = action.payload
        },
        // for the root or parent post in the post and replies page
        likePostInPostAndReplyPage: (state, action: PayloadAction<{ postId: string; user: User }>) => {
            if(!state.post || action.payload.postId !== state.post._id) return

            state.post = {
                ...state.post,
                liked_by: [...state.post.liked_by, action.payload.user],
                likes: state.post.likes + 1
            }
        },
         // for the root or parent post in the post and replies page
        unlikePostInPostAndReplyPage: (state, action: PayloadAction<{ postId: string; user: User }>) => {
            if(!state.post || action.payload.postId !== state.post._id) return

            state.post = {
                ...state.post,
                liked_by: state.post.liked_by.filter((user) => user._id !== action.payload.user._id),
                likes: state.post.likes - 1
            }
        },

        // for post and page replies
        setReplies: (state, action: PayloadAction<Post[]>) => {
            state.replies = action.payload
        },
        likePostReply: (state, action: PayloadAction<{ postId: string; user: User }>) => {
            state.replies = state.replies.map(postReply => {
                if (postReply._id === action.payload.postId) {
                return {
                    ...postReply,
                    liked_by: [...postReply.liked_by, action.payload.user],
                    likes: postReply.likes + 1
                    };
                }
                return postReply;
            });
        },
        unlikePostReply: (state, action: PayloadAction<{ postId: string; user: User }>) => {
            state.replies = state.replies.map(postReply => {
                if (postReply._id === action.payload.postId) {
                return {
                    ...postReply,
                    liked_by: postReply.liked_by.filter(user => user._id !== action.payload.user._id),
                    likes: postReply.likes - 1
                    };
                }
                return postReply;
            });
        },
        deletePostReply: (state, action: PayloadAction<string>) => {
            state.replies = state.replies.filter(postReply => postReply._id !== action.payload)
            // will update the children array of the parent or root post in post and reply page
            if(state.post){
                state.post = {
                    ...state.post,
                    children: state.post?.children.filter(postChild => postChild._id !== action.payload)
                }
            }
        },
        updatePostReply: (state, action: PayloadAction<Post>) => {
            state.replies = state.replies.map(postReply => postReply._id === action.payload._id ? action.payload : postReply)
        },
        likeParentOfRootPostInPostAndRepliesPage:  (state, action: PayloadAction<{ postId: string; user: User }>) => {
            if(state.post && state.post.parent && state.post.parent._id === action.payload.postId){
                state.post = {
                    ...state.post,
                    parent: {
                        ...state.post.parent,
                        liked_by: [...state.post.parent.liked_by, action.payload.user],
                        likes: state.post.parent.likes + 1
                    }
                }
            } 
        }, 

        // for user replies only
        setUserRepliesInProfilePage: (state, action: PayloadAction<Post[]>) => {
            state.userReplies = action.payload
        },
        unlikeParentOfRootPostInPostAndRepliesPage:  (state, action: PayloadAction<{ postId: string; user: User }>) => {
            if(state.post && state.post.parent && state.post.parent._id === action.payload.postId){
                state.post = {
                    ...state.post,
                    parent: {
                        ...state.post.parent,
                        liked_by: state.post.parent.liked_by.filter((user) => user._id !== action.payload.user._id),
                        likes: state.post.parent.likes - 1
                    }
                }
            }
        }, 
        likeParentOfRootPostReplyInUserReplies: (state, action: PayloadAction<{ postId: string; user: User }>) => {
            state.userReplies  = state.userReplies.map(userReply => {
                if(userReply.parent._id === action.payload.postId) {
                    return {
                        ...userReply,
                        parent: {
                            ...userReply.parent,
                            liked_by: [...userReply.parent.liked_by, action.payload.user],
                            likes: userReply.parent.likes + 1
                        }
                    }
                }
                return userReply
            })
        }, 
        unlikeParentOfRootPostReplyInUserReplies:  (state, action: PayloadAction<{ postId: string; user: User }>) => {
            state.userReplies  = state.userReplies.map(userReply => {
                if(userReply.parent._id === action.payload.postId) {
                    return {
                        ...userReply,
                        parent: {
                            ...userReply.parent,
                            liked_by: userReply.parent.liked_by.filter(user => user._id !== action.payload.user._id),
                            likes: userReply.parent.likes - 1
                        }
                    }
                }
                return userReply
            })
        },
        likeUserReplyInUserReplies: (state, action: PayloadAction<{ postId: string; user: User }>) => {
            state.userReplies  = state.userReplies.map(userReply => {
                if(userReply._id === action.payload.postId) {
                    return {
                        ...userReply,
                            liked_by: [...userReply.liked_by, action.payload.user],
                            likes: userReply.likes + 1
                    }
                }
                return userReply
            })
        }, 
        unlikeUserReplyInUserReplies:  (state, action: PayloadAction<{ postId: string; user: User }>) => {
            state.userReplies  = state.userReplies.map(userReply => {
                if(userReply._id === action.payload.postId) {
                    return {
                        ...userReply,
                            liked_by: userReply.liked_by.filter(user => user._id !== action.payload.user._id),
                            likes: userReply.likes - 1
                    }
                }
                return userReply
            })
        },
        deleteUserReplyInUserReplies: (state, action: PayloadAction<string>) => {
            state.userReplies = state.userReplies.filter(userReply => userReply._id !== action.payload)
        },
        updateUserReplyInUserReplies: (state, action: PayloadAction<Post>) => {
            state.userReplies = state.userReplies.map(userReply => userReply._id === action.payload._id ? action.payload : userReply )
        }
    },
})

export const { 
    setPosts, 
    addPost, 
    likePost, 
    unlikePost, 
    deletePost, 
    setImageUrl, 
    updatePost, 
    setPostToEdit, 
    setSinglePost, 
    likePostInPostAndReplyPage,
    unlikePostInPostAndReplyPage,
    setReplies,
    likePostReply,
    unlikePostReply,
    deletePostReply,
    updatePostReply,
    likeParentOfRootPostInPostAndRepliesPage,
    unlikeParentOfRootPostInPostAndRepliesPage,

    likeParentOfRootPostReplyInUserReplies,
    unlikeParentOfRootPostReplyInUserReplies,
    likeUserReplyInUserReplies,
    unlikeUserReplyInUserReplies,
    setUserRepliesInProfilePage,
    deleteUserReplyInUserReplies,
    updateUserReplyInUserReplies
} = postSlice.actions

export default postSlice.reducer