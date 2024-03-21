import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type RestSchema = {
  HOST: string;
  PORT: number;
  SALT: string;
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: string;
  DB_NAME: string;
  DB_RETRY_COUNT: number;
  DB_RETRY_TIMEOUT: number;
  JWT_SECRET: string;
  JWT_ALGORITHM: string;
  JWT_EXPIRED: string;
  UPLOAD_DIRECTORY_PATH: string;
  STATIC_DIRECTORY_PATH: string;
}

export const configRestSchema = convict<RestSchema>({
  HOST: {
    doc: 'Host where started service',
    format: String,
    env: 'HOST',
    default: null
  },
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: null
  },
  SALT: {
    doc: 'Salt for password hash',
    format: String,
    env: 'SALT',
    default: null
  },
  DB_HOST: {
    doc: 'IP address of the database server (MongoDB)',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: null
  },
  DB_USER: {
    doc: 'Username to connect to the database',
    format: String,
    env: 'DB_USER',
    default: null,
  },
  DB_PASSWORD: {
    doc: 'Password to connect to the database',
    format: String,
    env: 'DB_PASSWORD',
    default: null,
  },
  DB_PORT: {
    doc: 'Port to connect to the database (MongoDB)',
    format: 'port',
    env: 'DB_PORT',
    default: null,
  },
  DB_NAME: {
    doc: 'Database name (MongoDB)',
    format: String,
    env: 'DB_NAME',
    default: null
  },
  DB_RETRY_COUNT: {
    doc: 'The number of times to retry the database connection (MongoDB)',
    format: Number,
    env: 'DB_RETRY_COUNT',
    default: null
  },
  JWT_SECRET: {
    doc: 'Secret for sign JWT',
    format: String,
    env: 'JWT_SECRET',
    default: null
  },
  JWT_ALGORITHM: {
    doc: 'Algorithm for JWT',
    format: String,
    env: 'JWT_ALGORITHM',
    default: null
  },
  JWT_EXPIRED: {
    doc: 'JWT Expiration time',
    format: String,
    env: 'JWT_EXPIRED',
    default: null
  },
  DB_RETRY_TIMEOUT: {
    doc: 'The timeout in milliseconds between database connection retry attempts (MongoDB)',
    format: Number,
    env: 'DB_RETRY_TIMEOUT',
    default: null
  },
  UPLOAD_DIRECTORY_PATH: {
    doc: 'Directory for upload files',
    format: String,
    env: 'UPLOAD_DIRECTORY_PATH',
    default: null
  },
  STATIC_DIRECTORY_PATH: {
    doc: 'Path to directory with static resources',
    format: String,
    env: 'STATIC_DIRECTORY_PATH',
    default: null
  },
});
