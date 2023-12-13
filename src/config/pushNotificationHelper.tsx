import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

export const requestUserPermission = async (): Promise<void> => {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        // console.log('Authorization status:', authStatus);
        GetFCMToken();
    }
};

const GetFCMToken = async (): Promise<void> => {
    let fcmToken: string | null = await AsyncStorage.getItem("@fcmtoken");
    // console.log("old token ==>", fcmToken);
    if (!fcmToken) {
        try {
            const fcmToken: string = await messaging().getToken();
            if (fcmToken) {
                // console.log("new token ==>", fcmToken);
                await AsyncStorage.setItem("@fcmtoken", fcmToken);
            }
        } catch (error) {
            console.log("from catch ==>", error);
        }
    }
};

// export const notificationServices = () => {
//     messaging().onNotificationOpenedApp(remoteMessage => {
//         console.log(
//             'Notification caused app to open from background state:',
//             remoteMessage.notification,
//         );
//     });

//     // Foreground notification handling
//     messaging().onMessage(async remoteMessage => {
//         console.log("Notification caused app to show notification from foreground state:", remoteMessage);
//     });

//     // Check whether an initial notification is available
//     messaging()
//         .getInitialNotification()
//         .then(remoteMessage => {
//             if (remoteMessage) {
//                 console.log(
//                     'Notification caused app to open from quit state:',
//                     remoteMessage.notification,
//                 );
//             }
//         });
// };