import FSNetwork from '@brandingbrand/fsnetwork';

export interface AppBuilderServiceConfig {
  appId: string;
  apiKey: string;
  baseURL: string;
  cacheTTL?: number; // default = 10 mins
}

export interface Attribute {
  key: string;
  value: string;
}

export class AppBuilderService {
  appId: string;
  networkClient: FSNetwork;
  profileId?: string;
  pages: any[] = [];
  cacheTTL: number = 1000 * 60 * 10;

  constructor(config: AppBuilderServiceConfig) {
    this.appId = config.appId;
    if (typeof config.cacheTTL === 'number') {
      this.cacheTTL = config.cacheTTL;
    }

    this.networkClient = new FSNetwork({
      baseURL: config.baseURL,
      headers: {
        apikey: config.apiKey,
        'Content-Type': 'application/json'
      }
    });
  }

  async getPages(): Promise<any[]> {
    return this.networkClient.get(`/App/${this.appId}/pages`)
      .then((r: any) => r.data)
      .then((list: any) => list.map((data: any) => ({
        id: data.id,
        message: JSON.parse(data.message),
        title: data.title,
        slotId: data.slotId
      })))
      .then((pages: any[]) => {
        this.pages = pages;
        return pages;
      })
      .catch(async (e: any) => {
        console.log('Unable to fetch App Builder pages', e);

        let ret: any[] = [];

        // respond with stale cache if we have it
        if (this.pages.length) {
          ret = this.pages;
        }

        return Promise.resolve(ret);
      });
  }

}

