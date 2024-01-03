import { SafeAreaView, StyleSheet, Text, View, Dimensions, Image, ScrollView, Button, TouchableOpacity, Alert, PermissionsAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import FormModal from '../../utility/FormModal';
import { ImgUrl, url } from '../../config/StaticVariables';
import RNFetchBlob from 'rn-fetch-blob';


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

    const downloadFile = (url: string) => {
        const { config, fs } = RNFetchBlob;
        const fileDir = fs.dirs.DownloadDir;
        const flName = url.split("/public/userImg/")[1].split(".")[0];

        config({
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: fileDir + `/${flName}`,
                description: "Downloading..."
            },
        }).fetch("GET", url, {}).then(res => Alert.alert("", "File Downloaded."));
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
                        <Image style={{ width: 40, height: 40 }} source={require("../../assets/icons/add-user.png")} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setTracker(!tracker)}>
                        <Image style={{ width: 40, height: 40 }} source={require("../../assets/icons/reload.png")} />
                    </TouchableOpacity>

                    <Button title='Home' onPress={() => navigation.navigate("home")} />
                </View>

                {users.length ?
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{ paddingHorizontal: 10, marginTop: 10 }}
                    >
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
                                                                onPress={() => downloadFile(ImgUrl + item.profile_photo)}
                                                            >
                                                                <Image style={{ tintColor: "#2EBB92", width: 25, height: 25 }} source={require("../../assets/icons/downloads.png")} />
                                                            </TouchableOpacity>

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
                                                                { uri: ImgUrl + item.profile_photo }
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
                    :
                    <View
                        style={{ marginTop: 20, marginHorizontal: 10, marginBottom: 10, alignItems: "center", flex: 1, justifyContent: "center" }}
                    >
                        <Text style={{ color: "#000f0f", fontSize: 20 }}>
                            No Users Found!!!
                        </Text>
                    </View>
                }

                <FormModal show={showModal} modalFunc={modalFunc} userData={formValue} setUserData={setFormValue} tag={tag} closeModal={closeModal} />

                <View
                    style={{
                        position: "absolute",
                        width: width,
                        height: 2,
                        elevation: 4,
                        top: 67,
                    }}
                />
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
        paddingRight: 10,
        marginVertical: 10,
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
        marginVertical: 10,
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
        columnGap: 15,
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
        justifyContent: "center",
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