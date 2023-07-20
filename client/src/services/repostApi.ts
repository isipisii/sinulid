import { api } from "./api"
import { Repost } from "../types/types"

type CreateRepost = {
    postId: string
    token: string
}

type RemoveRepost = {
    repostId: string 
    token: string
}   

const repostApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createRepost: builder.mutation<Repost, CreateRepost>({
            query: ({postId, token}) => ({
                url: `/reposts/create/${postId}`,
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
        }),
        getUserReposts: builder.query<Repost[], void>({
            query: () => "/reposts"
        }),
        removeRepost: builder.mutation<void, RemoveRepost>({
            query: ({repostId, token}) => ({
                url: `/reposts/remove/${repostId}`,
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
        })
    })
})

export const {useGetUserRepostsQuery, useRemoveRepostMutation, useCreateRepostMutation} = repostApi