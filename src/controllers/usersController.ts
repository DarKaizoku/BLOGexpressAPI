import { Express, Request, Response, Router } from "express";
import * as bcrypt from 'bcrypt';
import client from "../constant/client";
import { UsersServices } from "../services/usersServices";


const usersRouter = new UsersServices();

export class UsersController{

    async register(req : Request,res : Response){
        try {
            const name: string = req.body.name;
            const password: string = req.body.password;
    
            
            const listNames: string[] | undefined = await usersRouter.getNames();
            
            
            
            if (name && password !== undefined) {
                if (listNames!.includes(name)) {
                    res.status(400).json({
                        status: "FAIL",
                        message: `Le nom ${name} existe déjà !!`
                    })
                    return
                }
                
                const registerOk = await usersRouter.addUser(name,password);
                
                res.status(200).json({
                    status: "OK",
                    message: `Nous vous avons bien enregistré, ${registerOk} !!`,
                    data: {name : registerOk}
                })
            }
            else{
                res.status(400).json({
                    status: "FAIL",
                    message: "Vérifiez vos données saisies !!"
                })
            }
    
        } catch (error) {
            console.log(error);
            res.status(404).json({
                status: "ECHEC",
                message: "!!! ERREUR !!!"
            })
        }
    }
}