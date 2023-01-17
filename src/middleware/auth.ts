import * as dotenv from 'dotenv';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { RequestWithUserRole } from '../types/TToken';
import TUsers from '../types/TUsers';

const secreToken = process.env.secreToken!;

export const verifyToken = (
        req: Request,
        res: Response,
        next: VoidFunction
) => {
        const authHeader = req.headers.authorization!;
        const token = authHeader.split(' ')[1]; // permet de supprimer "Bearer" de authorization !!
        if (!token) {
                res.send('Token Manquant !!');
        } else {
                jwt.verify(token, secreToken, (err: any, decoded: any) => {
                        if (err) {
                                console.log(err);
                                res.json({
                                        auth: false,
                                        message: 'Authentification échouée !!',
                                });
                        } else {
                                req.body.user_id = decoded.id;
                                next();
                        }
                });
        }
};
