import { env } from '@brandingbrand/fsapp';
import EpiserverDataSource from './EpiserverDataSource';
import { CommerceCloudDataSource } from '@brandingbrand/fssalesforce';
import { ShopifyDataSource } from '@brandingbrand/fsshopify';
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

} else if (env.dataSource.type === 'shopify') {
  const config: any = env.dataSource.apiConfig;
  dataSourceToExport = new ShopifyDataSource(config);

} else if (env.dataSource.type === 'commercecloud') {
  dataSourceToExport = new CommerceCloudDataSource({
    ...env.dataSource.apiConfig,
    middleware: commerceCloudMiddleware,
    networkClient: env.dataSource.apiConfig.networkClient ?
      new FSNetwork(env.dataSource.apiConfig.networkClient) :
      env.dataSource.apiConfig.networkClient
  });
} else {
  throw new Error('Data Source is not configured.');
}

export const dataSource = dataSourceToExport;
export const dataSourceConfig: DataSourceConfig = env.dataSource;


export function chooseDataSource(type: string, apiConfig: any): any {
  let dsToExport: CommerceDataSource;
  if (type === 'episerver') {
    dsToExport = new EpiserverDataSource(apiConfig.apiHost);
  } else if (type === 'commercecloud') {
    dsToExport = new CommerceCloudDataSource({
      ...apiConfig,
      middleware: commerceCloudMiddleware,
      networkClient: apiConfig.networkClient ?
        new FSNetwork(apiConfig.networkClient) :
        apiConfig.networkClient
    });
  } else if (type === 'shopify') {
    const config: any = apiConfig;
    dsToExport = new ShopifyDataSource(config);
  } else {
    throw new Error('No data source specified!');
  }
  return dsToExport;
}
