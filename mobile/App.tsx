import { AppLayout } from './components/layout/AppLayout';
import { AppNavigator } from './navigation/AppNavigator';

// Entry: index.ts:1 → App.tsx:1 — keep thin, all logic in screens/navigation
export default function App() {
  return (
    <AppLayout>
      <AppNavigator />
    </AppLayout>
  );
}
