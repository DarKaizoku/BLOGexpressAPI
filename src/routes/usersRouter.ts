import { Router } from 'express';
const usersRouter = Router();
import { UsersController } from '../controllers/usersController';
import { verifyToken } from '../middleware/auth';

const usersController = new UsersController();

usersRouter.post('/register', usersController.register);

usersRouter.post('/login', usersController.login);

usersRouter.put('/admin', verifyToken, usersController.setAdmin);

export default usersRouter;
