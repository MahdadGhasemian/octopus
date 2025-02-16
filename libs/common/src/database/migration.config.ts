import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

const env_path = `.env.migration.${process.env.MIGRATION_ENV_PATH}`;

dotenvConfig({ path: env_path });

const entities = [
  `apps/${process.env.SERVICE_MIGRATION}/src/libs/entities/*.entity{.ts,.js}`,
];

const migrations = [
  `migrations/${process.env.MIGRATION_ENV_PATH}/${process.env.SERVICE_MIGRATION}/*{.ts,.js}`,
];

const config = {
  type: 'postgres',
  host: `${process.env.POSTGRES_HOST}`,
  port: `${process.env.POSTGRES_PORT}`,
  database: `${process.env.POSTGRES_DATABASE}`,
  username: `${process.env.POSTGRES_USERNAME}`,
  password: `${process.env.POSTGRES_PASSWORD}`,
  // entities: ['dist/**/*.entity{.ts,.js}'],
  // entities: ['libs/common/src/entities/*.entity{.ts,.js}'],
  entities,
  // migrations: ['dist/migrations/*{.ts,.js}'],
  // migrations: ['migrations/*{.ts,.js}'],
  migrations,
  autoLoadEntities: true,
  synchronize: false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
