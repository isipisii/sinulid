import { FC } from 'react'
import { User } from '../types/types'
import RootPostAndReplyCard from '../components/cards/RootPostAndReplyCard'
import { useGetUserRepliesQuery } from '../services/authAndUserApi'

interface IUserReplies {
  userProfileInfo: User | null
}

const UserReplies: FC<IUserReplies> = ({ userProfileInfo }) => {
  const { data } = useGetUserRepliesQuery(userProfileInfo?._id ?? "")

  return (
    <div>
      {data?.map((reply) => (
          <RootPostAndReplyCard post={reply} isRootPost={false} key={reply._id}/>
      ))}
    </div>
  )
}

export default UserReplies