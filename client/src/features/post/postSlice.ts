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
    posts: [],
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
            state.posts = state.posts.map(post => post._id === action.payload._id ? {...action.payload} : post)
        },
        setSinglePost: (state, action: PayloadAction<Post>) => {
            state.post = action.payload
        },
        likePostInPostAndReplyPage: (state, action: PayloadAction<User>) => {
            if(!state.post) return

            state.post = {
                ...state.post,
                liked_by: [...state.post.liked_by, action.payload],
                likes: state.post.likes + 1
            }
        },
        unlikePostInPostAndReplyPage: (state, action: PayloadAction<User>) => {
            if(!state.post) return

            state.post = {
                ...state.post,
                liked_by: state.post.liked_by.filter((user) => user._id !== action.payload._id),
                likes: state.post.likes - 1
            }
        },
        setReplies: (state, action: PayloadAction<Post[]>) => {
            state.replies = action.payload
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
    setReplies
} = postSlice.actions

export default postSlice.reducer