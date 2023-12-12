import { StyleSheet, Text, View, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { notificationServices, requestUserPermission } from './src/config/pushNotificationHelper'
import messaging from '@react-native-firebase/messaging';



const App = () => {
  useEffect(() => {
    requestUserPermission();
    notificationServices()
  }, [])

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async ({notification}) => {
      // console.log(typeof notification);
      const titlestr = JSON.stringify(notification?.title);
      Alert.alert(titlestr, notification?.body);
    });

    return unsubscribe;
  }, []);

  return (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <Text style={{fontSize: 24, color: "#000"}}>App</Text>
    </View>
  )
}

export default App;

const styles = StyleSheet.create({});