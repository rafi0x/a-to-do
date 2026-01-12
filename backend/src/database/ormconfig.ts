import { join } from "path";
import { ENV, ormConfig } from "src/ENV";
import { DataSource } from "typeorm";

export const dbConnectionOptions = new DataSource({
  type: "mysql",
  host: ormConfig.host,
  port: ormConfig.port,
  username: ormConfig.username,
  password: ormConfig.password,
  database: ormConfig.database,
  synchronize: ormConfig.synchronize,
  dropSchema: false,
  migrationsRun: true,
  logging: ["migration", "error", "warn"],
  logger: ENV.isProduction ? "file" : "debug",
  // Load relations using additional queries instead of large joins to improve performance
  relationLoadStrategy: "query",
  // Include entities so DataSource builds metadata for relations (works for both ts-node and built js)
  entities: [join(__dirname, "../app/modules/**/entities/*.entity.{ts,js}")],
  // migrations: [join(__dirname, "migrations/*{.ts,.js}")],
});
