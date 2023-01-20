import { QueryResult } from 'pg';
import client from '../constant/client';
import TUsers from '../types/TUsers';

/**
 * Class permettant les envoies de requête vers la db concernant les users
 * * **.getNames()** : Requête l'accès aux name des users
 * * **.addUser()** : Requête l'ajout d'un user
 * * **.getDataUserbyName()** : Requête les datas d'un user par son name
 */
export class UsersServices {
    /**
     * Requête l'accès aux name des user
     * * Response : retourne le name des users sous forme de tableau
     */
    async getNames(): Promise<string[] | undefined> {
        const data: QueryResult<TUsers> = await client.query(
            'SELECT name FROM users'
        );

        if (data.rowCount) {
            const names: string[] = data.rows.map((data) => data.name);
            return names;
        }
        return undefined;
    }

    /**
     * Requête l'ajout d'un nouvel user
     * * Response : retourne le name et le password du user avant hashage
     */
    async addUser(name: string, password: string): Promise<string | undefined> {
        const data: QueryResult<TUsers> = await client.query(
            'INSERT INTO users (name,password) VALUES ($1,$2) RETURNING *',
            [name, password]
        );

        if (data.rowCount) {
            return data.rows[0].name;
        }
        return undefined;
    }

    /**
     * Requête l'accès aux user via le name
     * * Response : retourne la data du user demandé
     */
    async getDataUserbyName(name: string): Promise<TUsers | undefined> {
        const data: QueryResult<TUsers> = await client.query(
            'SELECT * FROM users WHERE name = $1',
            [name]
        );

        if (data.rowCount) {
            return data.rows[0];
        }
        return undefined;
    }
}
