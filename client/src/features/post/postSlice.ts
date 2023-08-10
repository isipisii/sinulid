import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Post, User } from '../../types/types'

interface IPostState {
    posts: Post[]
    viewImage: string,
    postToEdit: Post | null
    post: Post | null
    replies: Post[]
}

const initialState: IPostState = {
    posts: [], // posts inside the feed
    viewImage: "",
    postToEdit: null,
    post: null,
    replies: []
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
        // for replies
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
        // for replies
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
    updatePostReply
} = postSlice.actions

export default postSlice.reducer