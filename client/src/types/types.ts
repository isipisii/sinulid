export type SignUpCredential = {
    username: string
    email: string
    password: string
}

export type LogInCredentials = {
    email: string;
    password: string;
  };

export type User = {
    _id: string
    username: string
}