type CreatePostBody = {
    creator: string
    content: string
    image?: string | null
}

type SignUpBody = { 
    username: string
    email: string
    password: string
}
