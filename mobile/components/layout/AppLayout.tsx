import { GluestackUIProvider } from '@gluestack-ui/themed';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <GluestackUIProvider>
      <SafeAreaProvider>
        {children}
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
}
