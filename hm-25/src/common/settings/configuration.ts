// https://docs.nestjs.com/techniques/configuration#custom-configuration-files

import { DBType } from "../utils/utils";

enum Environments {
    DEVELOPMENT = 'DEVELOPMENT',
    STAGING = 'STAGING',
    PRODUCTION = 'PRODUCTION',
    TEST = 'TEST',
  }
  
  export type EnvironmentVariable = { [key: string]: string | undefined };
  
  export type ConfigurationType = ReturnType<typeof getConfig>;
  
  const getConfig = (
    environmentVariables: EnvironmentVariable,
    currentEnvironment: Environments,
  ) => {
    return {
      apiSettings: {
        PORT: Number.parseInt(environmentVariables.PORT || '3000'),
        SECRET_KEY: environmentVariables.SECRET_KEY,
      },
  
      databaseSettings: {
        MONGO_CONNECTION_URI: environmentVariables.MONGO_URL,
        MONGO_DB_NAME: environmentVariables.ENV === "DEVELOPMENT" ? environmentVariables.MongoDBName
                                                                  : environmentVariables.MongoDBNameForTest,
        DB_TYPE: environmentVariables.DB_TYPE as DBType,
        POSTGRES_DB_HOST: environmentVariables.POSTGRES_DB_HOST,
        POSTGRES_DB_PORT: parseInt(environmentVariables.POSTGRES_DB_PORT!, 10),
        POSTGRES_DB_USER_NAME: environmentVariables.POSTGRES_DB_USER_NAME,
        POSTGRESS_DB_PASSWORD: environmentVariables.POSTGRESS_DB_PASSWORD,                                        
        POSTGRES_DB_DATABASE_NAME: environmentVariables.ENV === "DEVELOPMENT" ? environmentVariables.POSTGRES_DB_DATABASE_NAME
                                                                              : environmentVariables.POSTGRES_DB_TEST_DATABASE_NAME,
      },
      emailSetting:{
        EMAIL_SENDER: environmentVariables.EMAIL_SENDER,
        EMAIL_PASSWORD: environmentVariables.EMAIL_PASSWORD,
      },
      jwtSetting:{
        JWT_ACCESS_SECRET: environmentVariables.JWT_ACCESS_SECRET!,
        JWT_REFRESH_SECRET: environmentVariables.JWT_REFRESH_SECRET!,
        EXPIRE_ACCESS_TOKEN_TIME: environmentVariables.EXPIRE_ACCESS_TOKEN_TIME!,
        EXPIRE_REFRESH_TOKEN_TIME: environmentVariables.EXPIRE_REFRESH_TOKEN_TIME!,
      },
  
      environmentSettings: {
        currentEnv: currentEnvironment,
        isProduction: currentEnvironment === Environments.PRODUCTION,
        isStaging: currentEnvironment === Environments.STAGING,
        isTesting: currentEnvironment === Environments.TEST,
        isDevelopment: currentEnvironment === Environments.DEVELOPMENT,
      },
    };
  };
  
  export default () => {
    const environmentVariables = process.env;
  
    // console.log('process.env.ENV =', environmentVariables.ENV);
    
    const currentEnvironment: Environments =
      environmentVariables.ENV as Environments;
  
    return getConfig(environmentVariables, currentEnvironment);
  };
  