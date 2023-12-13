import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'

interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
}

interface GenDummyContactProps {
    navigation: any;
}

const GenDummyContact: React.FC<GenDummyContactProps> = ({ navigation }) => {

    const generateRandomContact = (): Contact => {
        const generateRandomString = (length: number): string => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        };

        const generateRandomAddress = (): string => {
            const cities = ['CityA', 'CityB', 'CityC'];
            const states = ['StateA', 'StateB', 'StateC'];
            const randomCity = cities[Math.floor(Math.random() * cities.length)];
            const randomState = states[Math.floor(Math.random() * states.length)];
            return `${generateRandomString(8)}, ${randomCity}, ${randomState}`;
        };

        return {
            id: generateRandomString(8),
            firstName: generateRandomString(8),
            lastName: generateRandomString(8),
            email: `${generateRandomString(8)}@example.com`,
            phone: `+1${Math.floor(Math.random() * 10000000000)}`, // Assuming a North American format
            address: generateRandomAddress(),
        };
    }

    const dummyContact: Contact = generateRandomContact();
    console.log(dummyContact);

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 24, color: "#000" }}>GenDummyContact</Text>
            <View style={styles.spacer} />
            <Button title='Home' onPress={() => navigation.navigate("home")} />
        </View>
    )
}

export default GenDummyContact;

const styles = StyleSheet.create({
    spacer: {
        marginVertical: 20,
    }
})