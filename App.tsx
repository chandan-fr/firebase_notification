import { StyleSheet, Text, View, Alert, PermissionsAndroid } from 'react-native'
import React, { useEffect } from 'react'
import { requestUserPermission } from './src/config/pushNotificationHelper'
import messaging from '@react-native-firebase/messaging';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Home, {HomeProps} from './src/screens/stacknav/Home';
import Service from './src/screens/stacknav/Service';


const StackNav = createNativeStackNavigator();

const App: React.FC = () => {
  // const navigation = useNavigation();

  useEffect(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    requestUserPermission();
    // notificationServices()
  }, [])

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async ({ notification }) => {
      // console.log(typeof notification);
      const titlestr = JSON.stringify(notification?.title);
      Alert.alert(titlestr, notification?.body);
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <StackNav.Navigator initialRouteName='home'>
        <StackNav.Screen name='home' options={{ headerShown: false }} component={Home as React.ComponentType<HomeProps>} />
        <StackNav.Screen name='service' options={{ headerShown: false }} component={Service} />
      </StackNav.Navigator>
    </NavigationContainer>
  )
}

export default App;

const styles = StyleSheet.create({});