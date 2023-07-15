export type SignUpCredentials = {
    username: string
    email: string
    password: string
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
    displayed_picture: {
        url: string,
        cloudinary_id: string
    }
    bio: string
    link: string
    following: string[]
    followers: string[]
}

