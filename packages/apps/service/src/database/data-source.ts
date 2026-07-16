import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'node:path';
import * as fs from 'node:fs';

const serviceEnvPath = path.resolve(process.cwd(), '.env');
const rootEnvPath = path.resolve(process.cwd(), '../../../.env');
const envPath = fs.existsSync(serviceEnvPath) ? serviceEnvPath : rootEnvPath;
dotenv.config({ path: envPath });

const PostgresDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number.parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'autoteile26',
  password: process.env.POSTGRES_PASSWORD || 'changeme_in_local_env',
  database: process.env.POSTGRES_DB || 'autoteile26',
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: false,
  migrations: [__dirname + '/migrations/**/*.{ts,js}'],
  migrationsRun: false,
  migrationsTableName: 'migrations',
  migrationsTransactionMode: 'all',
});

export default PostgresDataSource;
