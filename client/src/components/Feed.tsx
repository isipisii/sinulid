import { FC, useEffect } from 'react'
import PostCard from './PostCard'
import CreatePostForm from './CreatePostForm'
import { useGetPostQuery } from '../services/postApi'

const Feed: FC= () => {
  const {data: posts, refetch: refetchPosts} = useGetPostQuery()

  useEffect(() => {
    refetchPosts()
  },[])

  return (
    <section className= "w-full pt-[70px] flex items-center flex-col justify-center gap-3">
        <CreatePostForm />
        <div className='flex flex-col gap-4 w-full max-w-[600px]'>
          {posts && posts.map((post, index) => (
            <PostCard key={index} post={post}/>
          ))}
        </div>
    </section>
  ) 
}

export default Feed