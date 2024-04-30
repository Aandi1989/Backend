import { DataSource } from 'typeorm';
import { config } from 'dotenv';


config();


export default new DataSource({
  // here must be full url string to data base where you gonna migrate
  // url: process.env.POSTGRES_DB_DEVELOPMENT_URL,
  url: process.env.POSTGRES_DB_DEVELOPMENT_URL,
  type: 'postgres',
  migrations: ['migrations/*.ts'],
  entities: ['src/**/*.entity.ts']
});


//  yarn migration:generate migrations/test ---  create migration
// yarn migration:run                       ---  apply migration