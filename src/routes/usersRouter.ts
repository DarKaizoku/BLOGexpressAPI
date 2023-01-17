import { Express, Request, Response, Router } from "express";
const usersRouter = Router();
import * as bcrypt from 'bcrypt';
import client from "../constant/client";
import TUsers from "../types/TUsers";
import { QueryResult } from "pg";
import { UsersController} from "../controllers/usersController";


const usersController = new UsersController();

usersRouter.post('/register', usersController.register);

usersRouter.post('/login', usersController.login);




export default usersRouter;