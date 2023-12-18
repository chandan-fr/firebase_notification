import { SafeAreaView, StyleSheet, Text, View, Dimensions, Image, ScrollView, Button, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import FormModal from '../../utility/FormModal';
import { ImgUrl, url } from '../../config/StaticVariables';


interface UserDataProps {
    navigation: any;
}

interface User {
    _id?: string,
    name?: string,
    email?: string,
    phone?: string,
    delete_flag?: boolean,
    profile_photo?: string,
    createdAt?: string,
    updatedAt?: string,
    __v?: string | number
}

const { width, height } = Dimensions.get("window");


const UserData: React.FC<UserDataProps> = ({ navigation }) => {
    const [users, setUsers] = useState<any>([]);
    const [tracker, setTracker] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [formValue, setFormValue] = useState<object>({ name: "", email: "", phone: "", password: "" });
    const [tag, setTag] = useState<string>("");


    const getAllUser = async (): Promise<void> => {
        const res = await axios.get(url + "/alluser");
        setUsers(res?.data?.data);
    };

    const addOneUser = async (): Promise<void> => {
        const res = await axios.post(url + "/adduser", formValue);

        if (res.data.success) {
            Alert.alert(res.data.message);
            setTracker(!tracker);
        } else {
            Alert.alert(res.data.message);
        }
        setFormValue({ name: "", email: "", phone: "", password: "" });
    };

    const modalFunc = (id: string | undefined) => {
        if (tag === "edit") {
            setShowModal(false);
            updateUser(id);
        }
        if (tag === "add") {
            setShowModal(false);
            addOneUser()
        }

    };

    const updateUser = async (id: string | undefined): Promise<void> => {
        const res = await axios.post(url + "/updateuser/" + id, formValue);

        if (res.data.success) {
            Alert.alert(res.data.message);
            setTracker(!tracker);
        } else {
            Alert.alert(res.data.message);
        }
        setFormValue({ name: "", email: "", phone: "", password: "" });
    };

    const deleteUser = async (id: string | undefined): Promise<void> => {
        const res = await axios.post(url + "/deleteuser/" + id);
        // console.log("delete user ==>", res?.data);
        if (res.data.success) {
            Alert.alert(res.data.message);
            setTracker(!tracker);
        } else {
            Alert.alert(res.data.message);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setFormValue({ name: "", email: "", phone: "", password: "" });
    };

    useEffect(() => {
        getAllUser();
    }, [tracker]);

    return (
        <SafeAreaView style={styles.parent}>
            <View style={styles.body}>
                <View style={styles.navbar}>
                    <Text style={styles.heading}>All Users</Text>

                    <TouchableOpacity onPress={() => { setShowModal(true); setTag("add") }}>
                        <Image style={{ width: 30, height: 30 }} source={require("../../assets/icons/add-user.png")} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setTracker(!tracker)}>
                        <Image style={{ width: 30, height: 30 }} source={require("../../assets/icons/reload.png")} />
                    </TouchableOpacity>

                    <Button title='Home' onPress={() => navigation.navigate("home")} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.cardWrap}>
                        {users?.map((item: User, index: number) => {
                            return (
                                <View key={item?._id}>
                                    {
                                        !item.delete_flag &&
                                        <View style={styles.cardContainer}>
                                            <View style={styles.cardLeft} />

                                            <View style={styles.cardRight}>
                                                <View style={styles.cardBox}>
                                                    <View style={styles.spacer} />
                                                    <View style={styles.spacer} />

                                                    <Text style={styles.nameField}>{item?.name}</Text>

                                                    <View style={styles.spacer} />
                                                    <View style={styles.spacer} />

                                                    <Text style={styles.phoneField}>
                                                        +91 {item?.phone}
                                                    </Text>
                                                    <View style={styles.spacer} />
                                                    <Text style={styles.emailField}>
                                                        {item?.email}
                                                    </Text>

                                                    <View style={styles.spacer} />
                                                    <View style={styles.spacer} />
                                                    <View style={styles.spacer} />
                                                    <View style={styles.actionContainer}>
                                                        <TouchableOpacity
                                                            style={styles.actionIconWrap}
                                                            onPress={() => { setShowModal(true); setTag("edit"); setFormValue(item) }}
                                                        >
                                                            <Image style={styles.actionIcon} source={require("../../assets/icons/pen.png")} />
                                                        </TouchableOpacity>

                                                        <TouchableOpacity
                                                            style={styles.actionIconWrap}
                                                            onPress={() => deleteUser(item?._id)}
                                                        >
                                                            <Image style={styles.actionIcon} source={require("../../assets/icons/bin.png")} />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>

                                            <View style={styles.imgWrap}>
                                                <Image
                                                    style={styles.profile}
                                                    source={
                                                        item?.profile_photo ? 
                                                        {uri: ImgUrl+item.profile_photo}
                                                        :
                                                        require("../../assets/images/user.png")
                                                    }
                                                />
                                            </View>
                                        </View>
                                    }
                                    {(index === users?.length - 1) ? null : (<View style={styles.spacer} />)}
                                </View>
                            )
                        })}
                    </View>
                </ScrollView>

                <FormModal show={showModal} modalFunc={modalFunc} userData={formValue} setUserData={setFormValue} tag={tag} closeModal={closeModal} />
            </View>
        </SafeAreaView>
    )
}

export default UserData;

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
    actionContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    actionIcon: {
        width: 40,
        height: 40,
    },
    actionIconWrap: {
        elevation: 6,
        backgroundColor: "#fff",
        borderRadius: 40,
        width: 42,
        height: 42,
        alignItems: "center",
        justifyContent: "center"
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