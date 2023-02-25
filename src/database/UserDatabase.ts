import { TUserDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
    public static TABLE_USERS = "users"

    public async findUsers(q: string | undefined){

        if (q) {
            const result: TUserDB[] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .where("name", "LIKE", `%${q}%`)

            return result

        } else {
            const result: TUserDB[] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            
            return result
        }
    }

    public async findUserById(id: string){
        const [userId]: TUserDB[] | undefined[] = await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .where({ id })

        return userId
    }

    public async findUserByEmail(email: string){
        const [userEmail]: TUserDB[] | undefined[] = await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .where({ email })

        return userEmail
    }

    public async insertUser(newUserDB: TUserDB){
        await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .insert(newUserDB)
    }

    public async deleteUserById(id: string){
        // const [userIdAlreadyExists]: TUserDB[] | undefined[] = await BaseDatabase
        // .connection(UserDatabase.TABLE_USERS)
        // .where({ id: idToDelete })

        await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .delete()
        .where({ id })

    }
}