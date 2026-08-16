import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.aivirtualphone',
  appName: 'AI Virtual Phone',
  webDir: 'public',
  server: {
    // 👇 改成你自己的 Vercel 地址
    url: 'https://ai-virtual-phone-topaz-two.vercel.app',
    androidScheme: 'https',
    cleartext: false
  }
};

export default config;
