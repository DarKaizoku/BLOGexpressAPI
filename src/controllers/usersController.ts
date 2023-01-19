import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { UsersServices } from '../services/usersServices';
import TUsers from '../types/TUsers';

const usersServices = new UsersServices();

const secreToken = process.env.secreToken!;

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
                                bcrypt.hash(
                                        password,
                                        10,
                                        async function (err, hash) {
                                                const registerOk =
                                                        await usersServices.addUser(
                                                                name,
                                                                hash
                                                        );

                                                res.status(200).json({
                                                        status: 'OK',
                                                        message: `Nous vous avons bien enregistré, ${registerOk} !!`,
                                                        data: {
                                                                name: registerOk,
                                                        },
                                                });
                                        }
                                );
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

        async login(req: Request, res: Response) {
                try {
                        const name: string = req.body.name;
                        const password: string = req.body.password;

                        const data = await usersServices.getDataUserbyName(
                                name
                        );

                        if (name === undefined || password === undefined) {
                                return res.status(400).json({
                                        status: 'FAIL',
                                        message: `Données manquantes !!`,
                                });
                        }
                        if (data) {
                                const hash = data.password;
                                const admin_status = data.admin_status;

                                bcrypt.compare(
                                        password,
                                        hash,
                                        async (err, result) => {
                                                const id = data.id;
                                                const token = jwt.sign(
                                                        {
                                                                id: id,
                                                                admin: admin_status,
                                                        },
                                                        secreToken
                                                );

                                                if (result) {
                                                        res.status(200).json({
                                                                status: 'OK',
                                                                message: `Vous êtes bien connecté.e !!`,
                                                                token: token,
                                                        });
                                                } else {
                                                        res.status(401).json({
                                                                status: 'FAIL',
                                                                message: `Le mot de passe de corresponnd pas !!`,
                                                        });
                                                }
                                        }
                                );
                        } else {
                                res.status(400).json({
                                        status: 'FAIL',
                                        message: `${name} n'a pas de compte !!`,
                                });
                        }
                } catch (error) {
                        console.log(error);
                        res.status(500).json({
                                status: 'FAIL',
                                message: `!!! ERREUR !!!`,
                        });
                }
        }

        async setAdmin(req: Request, res: Response) {
                const name = req.body.name;
                const admin = req.body.admin;

                if (!admin) {
                        return res.status(403).json({
                                status: 'FAIL',
                                message: `Vous n'avez pas les droits !!`,
                        });
                }

                if (name === undefined) {
                        return res.status(400).json({
                                status: 'FAIL',
                                message: `La donnée de nom est manquante !!`,
                        });
                }

                try {
                        const listNames = await usersServices.getNames();

                        if (!listNames?.includes(name)) {
                                return res.status(404).json({
                                        status: 'FAIL',
                                        message: `Le nom ${name} n'existe pas !!`,
                                });
                        }
                        const statusUp = await usersServices.updateStatusUser(
                                name
                        );

                        if (statusUp) {
                                return res.status(200).json({
                                        status: 'SUCCESS',
                                        message: `${name} est devenu.e Admin ou est déjà Admin !!`,
                                });
                        }
                } catch (error) {
                        console.log(error);
                        res.status(500).json({
                                status: 'FAIL',
                                message: `!!! ERREUR !!!`,
                        });
                }
        }
}
