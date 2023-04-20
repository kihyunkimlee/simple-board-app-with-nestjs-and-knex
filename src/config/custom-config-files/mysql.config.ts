import { registerAs } from '@nestjs/config';

export const MySQLConfigKey = 'mysql-config-key';

export interface MySQLConfigs {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

export const MySQLConfig = registerAs<MySQLConfigs>(MySQLConfigKey, () => {
  return {
    host: process.env.DATABASE_HOST_URL || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '3306'),
    database: process.env.DATABASE_NAME || 'test',
    user: process.env.DATABSE_USER || 'root',
    password: process.env.DATABASE_USER_PASS || '',
  };
});
