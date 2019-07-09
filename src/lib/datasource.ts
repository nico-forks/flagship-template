import { env } from '@brandingbrand/fsapp';
import EpiserverDataSource from './EpiserverDataSource';
import { CommerceCloudDataSource } from '@brandingbrand/fssalesforce';
import { CommerceDataSource } from '@brandingbrand/fscommerce';
import FSNetwork from '@brandingbrand/fsnetwork';
import { commerceCloudMiddleware } from './commerceCloudMiddleware';

let dataSourceToExport: CommerceDataSource;

export interface DataSourceConfig {
  type: string;
  categoryFormat: 'grid' | 'list';
  apiConfig: any;
}


if (env.dataSource.type === 'episerver') {
  dataSourceToExport = new EpiserverDataSource(env.dataSource.apiConfig.apiHost);
} else {
  dataSourceToExport = new CommerceCloudDataSource({
    ...env.dataSource.apiConfig,
    middleware: commerceCloudMiddleware,
    networkClient: env.dataSource.apiConfig.networkClient ?
      new FSNetwork(env.dataSource.apiConfig.networkClient) :
      env.dataSource.apiConfig.networkClient
  });
}

export const dataSource = dataSourceToExport;
export const dataSourceConfig: DataSourceConfig = env.dataSource;
