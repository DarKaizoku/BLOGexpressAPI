import { config } from "dotenv";
import { Client } from "pg";
config();

<<<<<<< HEAD


=======
>>>>>>> fee8e887e87c8f8f5e43943c5575a9951e2e912f
const client = new Client({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME, 
    password: process.env.DB_PASSWORD,
    port: 5432,
});

client.connect();

export default client;