import * as dotenv from 'dotenv';
dotenv.config();

export const ENV_DEVELOPMENT = "development";
export const ENV_PRODUCTION = "production";

export const ENV = {
  port: Number(process.env.PORT) || 3000,
  env: process.env.NODE_ENV || ENV_DEVELOPMENT,
  isProduction: process.env.NODE_ENV === ENV_PRODUCTION,
  isDevelopment: process.env.NODE_ENV === ENV_DEVELOPMENT,
  db: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    saltRound: Number(process.env.JWT_SALT_ROUNDS),
    tokenExpireIn: process.env.JWT_EXPIRES_IN
  },
};

export const ormConfig = {
  type: ENV.db.type,
  host: ENV.db.host,
  port: Number(ENV.db.port),
  username: ENV.db.username,
  password: ENV.db.password,
  database: ENV.db.database,
  synchronize: ENV.db.synchronize,
  logging: ENV.db.logging,
  autoLoadEntities: true
};
