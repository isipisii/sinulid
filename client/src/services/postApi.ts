import { Reply, Post } from "../types/types";
import { api } from "./api";

type CreatePost = {
    postData: FormData
    token: string
}

type UpdatePost = {
    updatePostData: FormData
    token: string
    postId: string
}

type DeletePost = {
    postId: string
    token: string
}

type LikePost = {
    postId: string
    token: string
}

type CreatePostReply = {
    postId: string
    token: string
    content: string
}

type DeletePostReply = {
    replyId: string
    token: string
}

//wasnt able to use prepareHeaders since some endpoint dont require headers
const postApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createPost: builder.mutation<Post, CreatePost>({
            query: ({postData, token}) => ({
                url: "/posts",
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }, 
                body: postData
            })
        }),
        deletePost: builder.mutation<void, DeletePost>({
            query: ({postId, token}) => ({
                url:`/posts/remove/${postId}`,
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }, 
            })
        }),
        updatePost: builder.mutation<Post, UpdatePost>({
            query: ({updatePostData, postId ,token }) => ({
                url: `/posts/update/${postId}`,
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: updatePostData
            })
        }),
        getPosts: builder.query<Post[], void>({
            query:() => "/posts"
        }),
        likePost: builder.mutation<void, LikePost>({
            query: ({token, postId}) => ({
                url: `/posts/like/${postId}`,
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
        }),
        unlikePost: builder.mutation<void, LikePost>({
            query: ({token, postId}) => ({
                url: `/posts/unlike/${postId}`,
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
        }),
        getPostReplies: builder.query<Reply[], string>({
            query: (postId) => `/replies/${postId}`
        }),
        createPostReply: builder.mutation<Reply, CreatePostReply>({
            query: ({postId, token, content}) => ({
                url: `/replies/create/${postId}`,
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: {
                    content
                }
            })
        }),
        deletePostReply: builder.mutation<void, DeletePostReply>({
            query:({token, replyId}) => ({
                url: `/replies/remove/${replyId}`,
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
        }),
        getUserPosts: builder.query<Post[], string>({
            query: (userId) => `posts/user-posts/${userId}`
        })
    })
})

export const { 
    useCreatePostMutation, 
    useDeletePostMutation, 
    useUpdatePostMutation,  
    useLazyGetPostsQuery, 
    useLikePostMutation, 
    useUnlikePostMutation,  
    useLazyGetPostRepliesQuery,
    useCreatePostReplyMutation,
    useDeletePostReplyMutation,
    useLazyGetUserPostsQuery
} = postApi