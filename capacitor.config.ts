import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'QrScan',
  webDir: 'www',
  bundledWebRuntime: false,
  "plugins": {
    "Camera": {}
  }
};

export default config;
