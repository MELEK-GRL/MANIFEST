import {
  NavigationContainer,
  createNavigationContainerRef,
  type LinkingOptions,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {View} from 'react-native';
import HomeScreen from '../screens/Home/HomeScreen';
import ManifestScreen from '../screens/Manifest/ManifestScreen';
import VisionBoardScreen from '../screens/VisionBoard/VisionBoardScreen';
import AffirmationsScreen from '../screens/Affirmations/AffirmationsScreen';
import LuckyNumbersScreen from '../screens/LuckyNumbers/LuckyNumbersScreen';
import LuckyNumbersDetailScreen from '../screens/LuckyNumbers/LuckyNumbersDetailScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import RegisterScreen from '../screens/Register/RegisterScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import colors from '../theme/colors';
import {useAuthHydrated, useAuthStore} from '../store/useAuthStore';
import type {RootStackParamList} from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['manifestapp://'],
  config: {
    screens: {
      Login: 'login',
      Register: 'register',
      Home: 'home',
      Manifest: 'manifest',
      VisionBoard: 'vision-board',
      Affirmations: 'affirmations',
      LuckyNumbers: 'lucky-numbers',
      LuckyNumbersDetail: 'lucky-numbers/:topicId',
      Profile: 'profile',
      Settings: 'settings',
    },
  },
};

function AppNavigator() {
  const hydrated = useAuthHydrated();
  const token = useAuthStore(state => state.token);

  if (!hydrated) {
    return <View style={{flex: 1, backgroundColor: colors.background}} />;
  }

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <Stack.Navigator
        initialRouteName={token ? 'Home' : 'Login'}
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Manifest" component={ManifestScreen} />
        <Stack.Screen name="VisionBoard" component={VisionBoardScreen} />
        <Stack.Screen name="Affirmations" component={AffirmationsScreen} />
        <Stack.Screen name="LuckyNumbers" component={LuckyNumbersScreen} />
        <Stack.Screen
          name="LuckyNumbersDetail"
          component={LuckyNumbersDetailScreen}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
