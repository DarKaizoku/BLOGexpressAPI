import { Express, Request, Response, Router } from 'express';
import * as bcrypt from 'bcrypt';
import client from '../constant/client';
import { UsersServices } from '../services/usersServices';

const usersServices = new UsersServices();

export class UsersController {
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
                        data: { name: registerOk },
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
            res.status(404).json({
                status: 'ERROR',
                message: '!!! ERREUR !!!',
            });
        }
    }

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
                    if (result) {
                        res.status(200).json({
                            status: 'OK',
                            message: `Vous êtes bien connecté.e !!`,
                        });
                    } else {
                        res.status(401).json({
                            status: 'FAIL',
                            message: `Le mot de passe de corresponnd pas !!`,
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
