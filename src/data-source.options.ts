import {DataSourceOptions} from 'typeorm';

require('dotenv').config();

// .ts under ts-node (migration CLI), .js when compiled - never the .d.ts files next to them in dist
const ext = __filename.endsWith('.ts') ? 'ts' : 'js';

/**
 * TypeORM >= 0.3 no longer reads TYPEORM_* environment variables on its own,
 * so map the existing variables explicitly. Shared by the app and the migration CLI.
 */
export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.TYPEORM_PORT || 3306),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true',
    entities: [`${__dirname}/**/*.entity.${ext}`],
    migrations: [`${__dirname}/migrations/*.${ext}`],
};
