import { env } from '@brandingbrand/fsapp';
import appbuilder from '../appbuilder';

const { engagement: {
  appId, apiKey, baseURL, cacheTTL
} } = env;

export const { appbuilderService, AppBuilderComponent } = appbuilder({
  appId,
  apiKey,
  baseURL,
  cacheTTL
});
// // ============ fetchPages ============ //
// // returns array of inbox message from engagement server
export async function fetchEngagementPages(): Promise<any[]> {
  const appbuilderResponse = await appbuilderService.getPages();
  return appbuilderResponse.map((message: any) => {
    return {
      id: message.id,
      content: message.message && message.message.layout,
      slotId: message.slotId
    };
  });
}
