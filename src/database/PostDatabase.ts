import { resourceLimits } from "worker_threads";
import { PostsDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";


export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts"

    public async findPosts(q: string | undefined) {

        if(q){
            const result: PostsDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)

            return result 
            
        }else{
            const result: PostsDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            
            return result
        }
    }

    public async findPostById(id: string) {
        const [postsId]: PostsDB[] | undefined[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .where({ id })

        return postsId
    }

    public async insertPost(newPostDB: PostsDB) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .insert(newPostDB)
    }

    public async updatePostById(id: string, newContent: string) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .update({ content: newContent })
            .where({ id })
    }

    public async deletePostById(id: string) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .delete()
            .where({ id })
    }

}