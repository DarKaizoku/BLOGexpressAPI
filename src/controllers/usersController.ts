import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { UsersServices } from '../services/usersServices';

const usersServices = new UsersServices();

const secreToken = process.env.secreToken!;

/**
 * Class permettant le contrôle des données entrantes pour les requête users
 * * **.register()** : Contrôle préalable à la création d'un nouvel utilisateur
 * * **.login()** : Contrôle préalable à la récupération d'un article via son id
 */
export class UsersController {
    /**
     * Vérification que le 'name' utilisé n'existe pas déjà et création d'un nouvel utilisateur
     * * Response.data retourne le nouvel utilisateur avec un password hashé
     */
    async register(req: Request, res: Response) {
        try {
            const name: string = req.body.name;
            const password: string = req.body.password;

            const listNames: string[] | undefined =
                await usersServices.getNames();

            if ((name && password) !== undefined) {
                if (listNames!.includes(name)) {
                    res.status(400).json({
                        status: 'FAIL',
                        message: `Le nom ${name} existe déjà !!`,
                    });
                    return;
                }
                bcrypt.hash(password, 10, async function (err, hash) {
                    const registerOk = await usersServices.addUser(name, hash);

                    res.status(200).json({
                        status: 'OK',
                        message: `Nous vous avons bien enregistré, ${registerOk} !!`,
                        data: {
                            name: registerOk,
                        },
                    });
                });
            } else {
                res.status(400).json({
                    status: 'FAIL',
                    message: 'Vérifiez vos données saisies !!',
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: 'ERROR',
                message: '!!! ERREUR !!!',
            });
        }
    }

    /**
     * Vérification que les données entrante sont présente en db si oui connecté et génération du token
     * * Response.data retourne un message de connection ainsi que le token généré
     */
    async login(req: Request, res: Response) {
        try {
            const name: string = req.body.name;
            const password: string = req.body.password;

            const data = await usersServices.getDataUserbyName(name);

            if (name === undefined || password === undefined) {
                return res.status(400).json({
                    status: 'FAIL',
                    message: `Données manquantes !!`,
                });
            }
            if (data) {
                const hash = data.password;

                bcrypt.compare(password, hash, async (err, result) => {
                    const id = data.id;
                    const token = jwt.sign({ id }, secreToken);

                    if (result) {
                        res.status(200).json({
                            status: 'OK',
                            message: `Vous êtes bien connecté.e !!`,
                            token: token,
                        });
                    } else {
                        res.status(401).json({
                            status: 'FAIL',
                            message: `Le mot de passe ne corresponnd pas !!`,
                        });
                    }
                });
            } else {
                res.status(400).json({
                    status: 'FAIL',
                    message: `${name} n'a pas de compte !!`,
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: 'ERROR',
                message: `!!! ERREUR !!!`,
            });
        }
    }
}
