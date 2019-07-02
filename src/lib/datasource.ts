import { env } from '@brandingbrand/fsapp';
import EpiserverDataSource from './EpiserverDataSource';

let dataSourceToExport: EpiserverDataSource;

export interface DataSourceConfig {
  categoryFormat: 'grid' | 'list';
  apiConfig: any;
}

dataSourceToExport = new EpiserverDataSource(env.dataSource.apiConfig.apiHost);

export const dataSource = dataSourceToExport;
export const dataSourceConfig: DataSourceConfig = env.dataSource;
