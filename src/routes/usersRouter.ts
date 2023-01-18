import { Router } from 'express';
const usersRouter = Router();
import { UsersController } from '../controllers/usersController';

const usersController = new UsersController();

//Route permettant de créer un nouvel user (name, password)
usersRouter.post('/register', usersController.register);

//Route permettant de se connecter et de créer un token
usersRouter.post('/login', usersController.login);

export default usersRouter;
