import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'



interface ServiceProps {
  navigation: any;
}


const Service: React.FC<ServiceProps> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 24, color: "#000" }}>Service</Text>
      <Button title='clickme' onPress={()=> navigation.navigate("home", {data: "from service", type: "string", extra: {}})} />
    </View>
  )
}

export default Service;

const styles = StyleSheet.create({})