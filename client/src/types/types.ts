export type SignUpCredentials = {
    username: string
    email: string
    password: string
    confirmPassword: string
    name: string
}

export type LogInCredentials = {
    email: string;
    password: string;
};

export type UpdateUserInfo = {
    bio: string
    link: string
    username: string
    image: File | null
}

export type User = {
    _id: string
    username: string
    name?:string
    displayed_picture?: {
        url: string,
        cloudinary_id: string
    }
    bio?: string
    link?: string
    following: string[]
    followers: string[]
}

export type Post = {
    creator: User
    _id: string 
    content: string
    image?: {
        url: string,
        cloudinary_id: string
    }
    likes: number
    createdAt: string 
    liked_by: User[]
}


export type Repost = {
    repost_creator: User
    post: Post
    createdAt: string 
}

export type Reply = {
    _id: string
    post_id: string
    creator: User
    content: string
    createdAt: string
}