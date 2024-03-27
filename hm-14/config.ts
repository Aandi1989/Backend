import { config } from 'dotenv';

config();

export const appConfig = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
  EXPIRE_ACCESS_TOKER_TIME: process.env.EXPIRE_ACCESS_TOKEN_TIME, // '10s' '10h' '10d'
  EXPIRE_REFRESH_TOKEN_TIME: process.env.EXPIRE_REFRESH_TOKEN_TIME, // '20s'
  EMAIL_SENDER: process.env.EMAIL_SENDER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
};
