import {
  NavigationContainer,
  createNavigationContainerRef,
  type LinkingOptions,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import ManifestScreen from '../screens/Manifest/ManifestScreen';
import VisionBoardScreen from '../screens/VisionBoard/VisionBoardScreen';
import AffirmationsScreen from '../screens/Affirmations/AffirmationsScreen';
import AngelNumbersScreen from '../screens/AngelNumbers/AngelNumbersScreen';
import type {RootStackParamList} from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['manifestapp://'],
  config: {
    screens: {
      Home: 'home',
      Manifest: 'manifest',
      VisionBoard: 'vision-board',
      Olumlamalar: 'olumlamalar',
      MelekSayilari: 'melek-sayilari',
    },
  },
};

const initialRouteName: keyof RootStackParamList = 'Home';

function AppNavigator() {
  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Manifest" component={ManifestScreen} />
        <Stack.Screen name="VisionBoard" component={VisionBoardScreen} />
        <Stack.Screen name="Affirmations" component={AffirmationsScreen} />
        <Stack.Screen name="AngelNumbers" component={AngelNumbersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
