import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthScreen } from "../screens/AuthScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { PlaceholderScreen } from "../screens/PlaceholderScreen";
import { getToken } from "../api/client";
import { QuizScreen } from "../screens/QuizScreen";
import { HistoryScreen } from "../screens/HistoryScreen";
import { StudyScreen } from "../screens/StudyScreen";

export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  NewReview: { topic: string };
  History: { title?: string; body?: string } | undefined;
  Study: undefined;
  HowItWorks: { title: string; body: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState<"Auth" | "Home" | null>(
    null,
  );

  useEffect(() => {
    getToken().then((token) => setInitialRoute(token ? "Home" : "Auth"));
  }, []);

  if (!initialRoute) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={initialRoute}
      >
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="NewReview"
          component={QuizScreen}
          options={{ title: "New review", headerShown: true }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: "My quizzes", headerShown: true }}
        />
        <Stack.Screen
          name="Study"
          component={StudyScreen}
          options={{ title: "Study", headerShown: true }}
        />
        <Stack.Screen
          name="HowItWorks"
          component={PlaceholderScreen}
          options={{ title: "How it works", headerShown: true }}
          initialParams={{
            title: "How it works",
            body: "Answer AI questions, get a score, and review the topics you missed. Guide coming soon.",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}