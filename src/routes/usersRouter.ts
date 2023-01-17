import { Router } from 'express';
const usersRouter = Router();
import { UsersController } from '../controllers/usersController';

const usersController = new UsersController();

usersRouter.post('/register', usersController.register);

usersRouter.post('/login', usersController.login);

export default usersRouter;
