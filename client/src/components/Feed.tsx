import { FC } from 'react'
import PostCard from './PostCard'
import CreatePostForm from './CreatePostForm'
import { useAppSelector } from '../features/app/hooks'

const Feed: FC = () => {
  const { token, user } = useAppSelector(state => state.auth)
  const { posts } = useAppSelector(state => state.post)

  return (
    <section className= "w-full pt-[70px] flex items-center flex-col justify-center gap-3 overflow-y-auto md:mx-[50px]">
        <CreatePostForm />
        <div className='flex flex-col gap-4 w-full max-w-[600px]'>
          {posts.map((post, index) => (
            <PostCard key={index} post={post} token={token} authenticatedUser={user} />
          ))}
        </div>
    </section>
  ) 
}

export default Feed