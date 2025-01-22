import * as dotenv from "dotenv";
dotenv.config();

import path from "path";

import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

const dirname = path.dirname(__dirname);

export const database = {
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
}

const options: DataSourceOptions & SeederOptions = {
  ...database,

  entities: [path.resolve(dirname, "src/entities/**/*.entity.{ts,js}")],
  logging: false,
  migrations: [path.resolve(dirname, "src/migrations/**/*.{ts,js}")],
  namingStrategy: new SnakeNamingStrategy(),
  seeds: [path.resolve(dirname, "src/seeds/**/*.seeder.{ts,js}")],
  synchronize: false,
  type: "postgres",
};

export const AppDataSource = new DataSource(options);
