import { QueryResult, QueryResultRow } from "pg";
import client from "../constant/client";
import TUsers from "../types/TUsers";

export class UsersServices {

    async getNames() : Promise<string[] | undefined>{
        
        const data : QueryResult<TUsers> = await client.query('select name from users');
        
        if (data.rowCount) {
            const names : string[] = data.rows.map(data => data.name);
            return names
        }
        return undefined
    };

    async addUser(name : string,password: string) : Promise<string | undefined>{

        const data : QueryResult<TUsers> = await client.query('insert into users (name,password) values ($1,$2) returning *',[name,password]);

        if (data.rowCount) {
            return data.rows[0].name
        }
        return undefined
    }
}
