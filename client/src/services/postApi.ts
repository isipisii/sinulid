import { Post } from "../types/types";
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
        getPost: builder.query<Post[], void>({
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
        })
    })
})

export const { useCreatePostMutation, useDeletePostMutation, useUpdatePostMutation,  useLazyGetPostQuery, useLikePostMutation, useUnlikePostMutation } = postApi