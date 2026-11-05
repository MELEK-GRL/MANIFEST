import {
  NavigationContainer,
  createNavigationContainerRef,
  type LinkingOptions,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import ManifestasyonScreen from '../screens/Manifestasyon/ManifestasyonScreen';
import VisionBoardScreen from '../screens/VisionBoard/VisionBoardScreen';
import OlumlamalarScreen from '../screens/Olumlamalar/OlumlamalarScreen';
import type {RootStackParamList} from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['manifestapp://'],
  config: {
    screens: {
      Home: 'home',
      Manifestasyon: 'manifestasyon',
      VisionBoard: 'vision-board',
      Olumlamalar: 'olumlamalar',
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
        <Stack.Screen name="Manifestasyon" component={ManifestasyonScreen} />
        <Stack.Screen name="VisionBoard" component={VisionBoardScreen} />
        <Stack.Screen name="Olumlamalar" component={OlumlamalarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
