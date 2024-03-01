import {config} from 'dotenv';

config()

export  const appConfig = {

    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
}