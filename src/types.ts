export enum USER_ROLES {
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
}

export  type TUserDB = {
    id: string,
    name: string,
    email: string,
    password: string,
    role: USER_ROLES,
    created_at: string
}

export  type TPostsDB = {
    id: string,
    creator_id: string, 
    content: string, 
    likes: number, 
    dislikes: number,
    created_at: string,
    updated_at: string
}

export type TLikesDislikesDB ={
    user_id: string,
    post_id: string,
    like: number
}

export  type TPostsWithUsers = {
    id: string,
    creator_id: string, 
    content: string, 
    likes: number, 
    dislikes: number,
    created_at: string,
    updated_at: string,
    like: TUserDB[]
}