import { UserDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
    public static TABLE_USERS = "users"

    public async findUsers(q: string | undefined){

        if (q) {
            const result: UserDB[] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .where("name", "LIKE", `%${q}%`)

            return result

        } else {
            const result: UserDB[] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            
            return result
        }
    }

    public async findUserById(id: string){
        const [userId]: UserDB[] | undefined[] = await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .where({ id })

        return userId
    }

    public async findUserByEmail(email: string){
        const [userEmail]: UserDB[] | undefined[] = await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .where({ email })

        return userEmail
    }

    public async insertUser(newUserDB: UserDB){
        await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .insert(newUserDB)
    }
}