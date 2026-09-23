import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthScreen } from '../screens/AuthScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';
import { getToken } from '../api/client';
import { QuizScreen } from '../screens/QuizScreen';

export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  NewReview: { topic: string };
  History: { title: string; body: string };
  HowItWorks: { title: string; body: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState<'Auth' | 'Home' | null>(null);

  useEffect(() => {
    getToken().then((token) => setInitialRoute(token ? 'Home' : 'Auth'));
  }, []);

  if (!initialRoute) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="NewReview"
          component={QuizScreen}
        />
        <Stack.Screen
          name="History"
          component={PlaceholderScreen}
          initialParams={{
            title: 'My quizzes',
            body: 'Completed quizzes and topic reviews will appear here once saved to the backend.',
          }}
        />
        <Stack.Screen
          name="HowItWorks"
          component={PlaceholderScreen}
          initialParams={{
            title: 'How it works',
            body: 'Answer AI questions, get a score, and review the topics you missed. Guide coming soon.',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
