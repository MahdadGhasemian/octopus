import { config as dotenvConfig } from 'dotenv';

const env_path = `${__dirname}/../../../.env.test`;

dotenvConfig({ path: env_path });
