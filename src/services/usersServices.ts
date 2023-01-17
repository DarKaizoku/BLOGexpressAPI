import { QueryResult } from "pg";
import client from "../constant/client";
import TUsers from "../types/TUsers";
import * as bcrypt from "bcrypt";

export class UsersServices {
        //method getNames est une requete SQL pour obtenir tous les noms du tableau users.
        async getNames(): Promise<string[] | undefined> {
                const data: QueryResult<TUsers> = await client.query(
                        "select name from users"
                );

                if (data.rowCount) {
                        const names: string[] = data.rows.map(
                                (data) => data.name
                        );
                        return names;
                }
                return undefined;
        }
        //method addUser est une requete SQL pour créer une nouvelle ligne dans le tableau users.
        async addUser(
                name: string,
                password: string
        ): Promise<string | undefined> {
                const data: QueryResult<TUsers> = await client.query(
                        "insert into users (name,password) values ($1,$2) returning *",
                        [name, password]
                );

                if (data.rowCount) {
                        return data.rows[0].name;
                }
                return undefined;
        }
        //method getDataUserbyName est une requete SQL pour récupérer les données d'un utilisateur via son nom .
        async getDataUserbyName(name: string): Promise<TUsers | undefined> {
                const data: QueryResult<TUsers> = await client.query(
                        "select * from users where name = $1",
                        [name]
                );

                if (data.rowCount) {
                        return data.rows[0];
                }
                return undefined;
        }
}
