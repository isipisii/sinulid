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
    followerCount: number
    following: User[]
    followers: User[] 
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
    type: string,
    children: Post[]
    parent: Post
}

export type Repost = {
    _id: string
    repost_creator: User
    post: Post
    createdAt: string 
    type: string
}

export enum ItemType {
    Repost = "repost",
    Post = "post"
}