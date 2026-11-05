import {
  NavigationContainer,
  createNavigationContainerRef,
  type LinkingOptions,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import ManifestScreen from '../screens/Manifest/ManifestScreen';
import VisionBoardScreen from '../screens/VisionBoard/VisionBoardScreen';
import OlumlamalarScreen from '../screens/Olumlamalar/OlumlamalarScreen';
import MelekSayilariScreen from '../screens/MelekSayilari/MelekSayilariScreen';
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
        <Stack.Screen name="Olumlamalar" component={OlumlamalarScreen} />
        <Stack.Screen name="MelekSayilari" component={MelekSayilariScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
