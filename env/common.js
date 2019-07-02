module.exports = {
  desktopHost: 'https://www.brandingbrand.com',
  name: 'EpiserverDemo',
  displayName: 'EpiserverDemo',
  enabledCapabilitiesIOS: [],
  buildConfig: {
    ios: {
      exportTeamId: '762H5V79XV',
      deployScheme: 'Provisioned',
      appCertDir: 'episerverDemo',
      provisioningProfileName: 'Episerver Demo Distribution'
    }
  },
  launchScreen: {
    android: 'assets/launchScreen/android',
    ios: {
      images: 'assets/launchScreen/ios/LaunchImages.xcassets',
      xib: 'assets/launchScreen/ios/LaunchScreen.xib'
    }
  },
  dataSource: {
    type: 'episerver',
    categoryFormat: 'list',
    catalogName: 'Fashion',
    apiConfig: {
      apiHost: 'https://episerver.uat.bbhosted.com',
    },
    promoProducts: {
      categoryId: 'shirts',
      title: 'Recommended for You'
    }
  },
  entitlementsFileIOS: './uat.entitlements',
  googleAnalytics: {
    android: '',
    ios: ''
  },
  cmsEnvironment: 1,
  cmsPropertyId: 482,
  dataSourceConfigs: {
    bazaarVoice: {
      endpoint: 'https://api.bazaarvoice.com',
      passkey: ''
    }
  },
  apiHost: 'https://api.example.com',
  publicVersionNumber: '1.0.0',
  require: [],
  appIds: {
    android: 'com.brandingbrand.reactnative.and.episerverdemo',
    ios: 'com.brandingbrand.reactnative.episerverdemo',
  },
  appIconDir: {
    android: 'assets/appIcon/android',
    ios: 'assets/appIcon/ios'
  },
  bundleIds: {
    android: 'com.brandingbrand.reactnative.and.episerverdemo',
    ios: 'com.brandingbrand.reactnative.episerverdemo',
  },
  engagement: {
    baseURL: 'https://kong.uat.bbhosted.com/engagement/v1',
    cacheTTL: 0,
    appId: '302891af-778a-46aa-abdc-7297e72a1809',
    apiKey: 'f3e1a902963f3364980b31e7ad0ea4'
  },
  usageDescriptionIOS: [
    {
      key: 'NSAppleMusicUsageDescription',
      string: ''
    },
    {
      key: 'NSBluetoothPeripheralUsageDescription',
      string: ''
    },
    {
      key: 'NSCalendarsUsageDescription',
      string: ''
    },
    {
      key: 'NSCameraUsageDescription',
      string: ''
    },
    {
      key: 'NSLocationWhenInUseUsageDescription',
      string: ''
    },
    {
      key: 'NSMotionUsageDescription',
      string: ''
    },
    {
      key: 'NSPhotoLibraryAddUsageDescription',
      string: ''
    },
    {
      key: 'NSPhotoLibraryUsageDescription',
      string: ''
    },
    {
      key: 'NSSpeechRecognitionUsageDescription',
      string: ''
    },
    {
      key: 'NSFaceIDUsageDescription',
      string: ''
    }
  ],
  associatedDomains: [],
  targetedDevices: 'Universal'
};
