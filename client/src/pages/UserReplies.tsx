import { FC } from 'react'
import { User } from '../types/types'

interface IUserReplies {
  userProfileInfo: User | null
}

const UserReplies: FC<IUserReplies> = ( {userProfileInfo }) => {
  console.log(userProfileInfo?._id)
  return (
    <div>UserReplies</div>
  )
}

export default UserReplies