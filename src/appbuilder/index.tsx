import { ComponentClass } from 'react';
import { AppBuilderService, AppBuilderServiceConfig } from './AppBuilderService';
import AppBuilderComponent from './AppBuilderComponent';
import layoutComponents from './blocks';

export interface AppBuilderUtilities {
  appbuilderService: any;
  AppBuilderComponent: ComponentClass<any>;
}

export default function(params: AppBuilderServiceConfig): AppBuilderUtilities {
  const api = new AppBuilderService(params);
  return {
    appbuilderService: api,
    AppBuilderComponent: AppBuilderComponent({ ...layoutComponents })
  };
}
