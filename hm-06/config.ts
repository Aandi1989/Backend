import {config} from 'dotenv';

config()

export  const appConfig = {

    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET as string,
    EXPIRE_TIME: process.env.EXPIRE_TOKEN_TIME 
}