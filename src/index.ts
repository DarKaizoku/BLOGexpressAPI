// imports
import * as express from 'express';
import * as dotenv from 'dotenv';
import { JwtPayload } from 'jsonwebtoken';
import usersRouter from './routes/usersRouter';
dotenv.config();

import articlesRouter from './routes/articlesRouter';
import commentsRouter from './routes/commentsRouter';

declare global {
        namespace Express {
                interface Request {
                        user?: JwtPayload; // permet d'inserer un user a req pour l'id
                }
        }
}

// Init environment variables (see .env.local file if it doesn't exist go to README.md file)
dotenv.config({ path: '.env' });

// Express server creation
const app = express();
const port = process.env.PORT || 8080;

// for parsing application/json
app.use(express.json());

// Add headers before the routes are defined
app.use(function (req, res, next) {
        res.setHeader('authorization', '');
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

        // Request methods you wish to allow
        res.setHeader(
                'Access-Control-Allow-Methods',
                'GET, POST, OPTIONS, PUT, PATCH, DELETE'
        );

        // Request headers you wish to allow
        res.setHeader(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        );

        // Pass to next layer of middleware
        next();
});

/************************************************
 * Add the route here
 */
app.use('/api/articles', articlesRouter);
app.use('/api/users', usersRouter);
app.use('/api/comments', commentsRouter);

// Bind express server on port 8080
app.listen(port, () => {
        console.log(
                `Express server has started on port ${port}. Open http://localhost:${port} to see results`
        );
});
