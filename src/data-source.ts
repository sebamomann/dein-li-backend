import {DataSource} from 'typeorm';
import {dataSourceOptions} from './data-source.options';

// Used by the TypeORM CLI (see migrations:* scripts in package.json)
export default new DataSource(dataSourceOptions);
