import { PermissionsAndroid, SafeAreaView, StyleSheet, Text, View, Dimensions, Image, ScrollView, Platform, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import Contacts from 'react-native-contacts';

interface GetAllContactsProps {
    navigation: any;
}

interface Contact {
    displayName?: string;
    phoneNumbers?: { number?: string }[];
    emailAddresses?: { email?: string }[];
    postalAddresses?: { formattedAddress?: string }[];
}

const { width, height } = Dimensions.get("window");

const GetAllContacts: React.FC<GetAllContactsProps> = ({ navigation }) => {
    const [contacts, setContacts] = useState<any | null>(null);

    const getContactsFromDevice = async (): Promise<void> => {
        try {
            const res = await Contacts.getAll();
            setContacts(res);
        } catch (error) {
            console.log("getContactsFromDevice Error==>", error);
        }
    };

    const getContactsPermission = async (): Promise<void> => {
        try {
            const success = await PermissionsAndroid.check("android.permission.READ_CONTACTS");
            if (success) {
                getContactsFromDevice();
            } else {
                if (Number(Platform.Version) >= 30) {
                    const res = await PermissionsAndroid.check("android.permission.READ_PHONE_NUMBERS");
                    if (!res) await PermissionsAndroid.request("android.permission.READ_PHONE_NUMBERS");
                } else {
                    const res = await PermissionsAndroid.check("android.permission.READ_PHONE_STATE");
                    if (!res) await PermissionsAndroid.request("android.permission.READ_PHONE_STATE");
                }
                const granted = await PermissionsAndroid.request("android.permission.READ_CONTACTS");
                if (PermissionsAndroid.RESULTS.GRANTED === granted) {
                    getContactsFromDevice();
                }
            }
        } catch (err) {
            console.log("getContactsPermission Error==>", err);
        }
    }

    useEffect(() => {
        getContactsPermission();
    }, []);

    return (
        <SafeAreaView style={styles.parent}>
            <View style={styles.body}>
                <View style={styles.navbar}>
                    <Text style={styles.heading}>All Contacts</Text>
                    <Button title='Home' onPress={() => navigation.navigate("home")} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.cardWrap}>
                        {contacts?.map((item: Contact, index: number) => {
                            return (
                                <View key={index}>
                                    <View style={styles.cardContainer}>
                                        <View style={styles.cardLeft} />

                                        <View style={styles.cardRight}>
                                            <View style={styles.cardBox}>
                                                <View style={styles.spacer} />
                                                <View style={styles.spacer} />

                                                <Text style={styles.nameField}>{item?.displayName}</Text>

                                                <View style={styles.spacer} />
                                                <View style={styles.spacer} />

                                                <Text style={styles.phoneField}>
                                                    {item?.phoneNumbers && (
                                                        <Text style={styles.phoneField}>
                                                            {item.phoneNumbers[0]?.number}
                                                        </Text>
                                                    )}
                                                    {/* {item?.phoneNumbers?.map((phoneNumber) => phoneNumber.number).join(', ')} */}
                                                    {/* I use the join function to concatenate the phone numbers into a single string, separated by commas. */}
                                                </Text>
                                                <View style={styles.spacer} />
                                                <Text style={styles.emailField}>
                                                    {item?.emailAddresses?.map((emailAddresse) => emailAddresse.email)}
                                                </Text>
                                                <View style={styles.spacer} />
                                                <Text style={styles.addressField}>
                                                    {item?.postalAddresses?.map((postalAddresse) => postalAddresse.formattedAddress).join(', ')}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.imgWrap}>
                                            <Image style={styles.profile} source={require("../../assets/images/man.png")} />
                                        </View>
                                    </View>
                                    {(index === contacts?.length - 1) ? null : (<View style={styles.spacer} />)}
                                </View>
                            )
                        })}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default GetAllContacts;

const styles = StyleSheet.create({
    parent: {
        flex: 1,
    },
    body: {
        flex: 1,
    },
    navbar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        marginRight: 10
    },
    heading: {
        color: "#000",
        fontSize: 22,
        fontWeight: "600",
        marginLeft: 10,
        marginTop: 10,
    },
    cardWrap: {
        flex: 1,
        marginTop: 20,
        marginHorizontal: 10,
        marginBottom: 10,
    },
    cardContainer: {
        position: "relative",
        flexDirection: "row",
        backgroundColor: "#fff",
        elevation: 4,
        borderRadius: 8,
        minHeight: height / 4,
    },
    cardLeft: {
        flex: 1,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        backgroundColor: "#8b008b",
    },
    cardRight: {
        flex: 2,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        paddingLeft: 65,
        paddingRight: 10,
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    cardBox: {
        // borderWidth: 1,
    },
    imgWrap: {
        position: "absolute",
        borderRadius: 100,
        top: 40,
        left: 40
    },
    profile: {
        width: 120,
        height: 120,
        borderRadius: 100
    },
    nameField: {
        fontSize: 20,
        fontWeight: "500",
        color: "#cc00cc"
    },
    phoneField: {
        fontSize: 17,
        color: "#6c244c"
    },
    emailField: {
        fontSize: 17,
        color: "#6c244c"
    },
    addressField: {
        fontSize: 16,
        color: "#6c244c"
    },
    spacer: {
        marginVertical: 3,
    },
});