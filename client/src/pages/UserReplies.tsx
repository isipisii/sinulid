import { FC, useEffect } from 'react'
import { User } from '../types/types'
import RootPostAndReplyCard from '../components/cards/RootPostAndReplyCard'
import { useGetUserRepliesQuery } from '../services/authAndUserApi'
import { useAppDispatch, useAppSelector } from '../features/app/hooks'
import { setUserRepliesInProfilePage } from '../features/post/postSlice'

interface IUserReplies {
  userProfileInfo: User | null
}

const UserReplies: FC<IUserReplies> = ({ userProfileInfo }) => {
  const { data: replies, refetch } = useGetUserRepliesQuery(userProfileInfo?._id ?? "")
  const dispatch = useAppDispatch()
  const { userReplies } = useAppSelector(state => state.post)
  
  useEffect(() => {
    if(replies){
      dispatch(setUserRepliesInProfilePage(replies))
    }
  },[replies])

  return (
    <div>
      {userReplies?.map((reply) => (
          <RootPostAndReplyCard post={reply} isRootPost={false} key={reply._id}/>
      ))}
    </div>
  )
}

export default UserReplies