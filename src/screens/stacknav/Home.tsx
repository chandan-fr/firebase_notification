import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouteProp } from '@react-navigation/native'; // Ensure correct import
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_KEY } from '../../config/StaticVariables';

export interface HomeProps {
  navigation: NativeStackNavigationProp<any, 'home'>;
  route: RouteProp<any, 'home'>;
}


const Home: React.FC<HomeProps> = ({ navigation, route }) => {
  // let token: string | null = null;
  const [token, setToken] = useState<string | null>(null);
  const { data, type, extra } = route?.params ?? { data: null, type: undefined, extra: {} };

  const getFirebaseToken = async (): Promise<void> => {
    const res: string | null = await AsyncStorage.getItem("@fcmtoken");
    setToken(res);
  }

  useEffect(() => {
    getFirebaseToken();
  }, [token]);


  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#62C1E5" }}>
      <Text style={{ fontSize: 24, color: "#000", marginBottom: 10 }}>Server Key</Text>
      <Text style={{ fontSize: 16, color: "#000", marginBottom: 10 }}>*Long press to copy</Text>
      <Text selectable={true} style={{ fontSize: 16, color: "#000", marginHorizontal: 10, marginBottom: 30 }}>
        {SERVER_KEY}
      </Text>

      <Text style={{ fontSize: 24, color: "#000", marginBottom: 10 }}>Token</Text>
      <Text style={{ fontSize: 16, color: "#000", marginBottom: 10 }}>*Long press to copy</Text>
      <Text selectable={true} style={{ fontSize: 16, color: "#000", marginHorizontal: 10, marginBottom: 30 }}>
        {token}
      </Text>
      <Button title='Service' onPress={() => navigation.navigate("service")} />
      <View style={styles.spacer} />
      <Button title='Generate Contact' onPress={() => navigation.navigate("gencontact")} />
      <View style={styles.spacer} />
      <Button title='Get Contacts' onPress={() => navigation.navigate("getcontact")} />
    </View>
  )
}

export default Home;

const styles = StyleSheet.create({
  spacer: {
    marginVertical: 20,
  }
})