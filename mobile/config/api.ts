import { Platform } from 'react-native';

// Auto-detect: web -> localhost, phone/emulator -> LAN IP
// Override via .env: EXPO_PUBLIC_API_URL=http://xxx:8000/api
const LAN_API = 'http://192.168.0.112:8000/api';
const WEB_API = 'http://localhost:8000/api';
const EMULATOR_API = 'http://10.0.2.2:8000/api';

function getDefaultApi() {
  if (Platform.OS === 'web') return WEB_API;
  // Android emulator detection: if you run via emulator, set EXPO_PUBLIC_API_URL to EMULATOR_API
  return LAN_API;
}

export const API_URL = process.env.EXPO_PUBLIC_API_URL || getDefaultApi();
export const WEB_API_URL = WEB_API;
export const LAN_API_URL = LAN_API;
export const EMULATOR_API_URL = EMULATOR_API;
