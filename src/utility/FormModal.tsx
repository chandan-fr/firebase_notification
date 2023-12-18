import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Dimensions, KeyboardAvoidingView, GestureResponderEvent, Image } from 'react-native';

interface FormModalProps {
    show: boolean;
    modalFunc: Function;
    userData: {
        _id?: string,
        name?: string,
        email?: string,
        phone?: string,
        password?: string,
        createdAt?: string,
        updatedAt?: string,
        __v?: string | number
    };
    setUserData: Function;
    tag: string | null;
    closeModal: Function;
};

const { width, height } = Dimensions.get("window");



const FormModal: React.FC<FormModalProps> = ({ show, modalFunc, userData, setUserData, tag, closeModal }) => {
    const handlePress = (event: GestureResponderEvent) => {
        if (userData.name && userData.phone && userData.email && userData.password) {
            modalFunc(userData?._id);
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={show}
        >
            {/* <KeyboardAvoidingView> */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalView}>
                    <View style={styles.centeredView}>
                        <View style={styles.headWrap}>
                            <Text style={styles.modalText}>{tag === "edit" ? "Edit User" : "Create User"}</Text>
                            <TouchableOpacity onPress={() => closeModal()}>
                                <Image style={{ width: 30, height: 30 }} source={require("../assets/icons/remove.png")} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.formGrp}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={styles.inputBox}
                                placeholder='Enter Name'
                                value={userData?.name}
                                onChangeText={value => setUserData({ ...userData, name: value })}
                            />

                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.inputBox}
                                placeholder='Enter Email'
                                keyboardType="email-address"
                                value={userData?.email}
                                onChangeText={value => setUserData({ ...userData, email: value })}
                                editable={tag === "edit" ? false : true}
                            />

                            <Text style={styles.label}>Phone</Text>
                            <TextInput
                                style={styles.inputBox}
                                placeholder='Enter Phone'
                                keyboardType="number-pad"
                                maxLength={10}
                                value={userData?.phone}
                                onChangeText={value => setUserData({ ...userData, phone: value })}
                            />

                            {tag === "add" ?
                                <>
                                    <Text style={styles.label}>Password</Text>
                                    <TextInput
                                        style={styles.inputBox}
                                        placeholder='Enter Password'
                                        secureTextEntry={true}
                                        value={userData?.password}
                                        onChangeText={value => setUserData({ ...userData, password: value })}
                                    />
                                </>
                                :
                                null
                            }
                        </View>

                        <TouchableOpacity style={styles.btn} onPress={handlePress} >
                            <Text style={styles.btnText}>{tag === "edit" ? "Update" : "Add User"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback >
            {/* </KeyboardAvoidingView> */}
        </Modal>
    )
}

export default FormModal;

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        justifyContent: "center"
    },
    centeredView: {
        backgroundColor: "#fff",
        marginHorizontal: 30,
        borderRadius: 10,
        elevation: 4,
    },
    headWrap: {
        flexDirection: "row",
        marginTop: 15,
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 10
    },
    formGrp: {
        marginHorizontal: 15,
        marginTop: 20,
    },
    modalText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#cc00cc"
    },
    label: {
        marginBottom: 10,
        fontSize: 17,
        fontWeight: "500"
    },
    inputBox: {
        borderWidth: 1,
        marginBottom: 15,
        paddingLeft: 10,
        borderRadius: 10,
        height: 40,
        borderColor: "#6c244c"
    },
    btn: {
        alignItems: "center",
        backgroundColor: "#8b008b",
        marginTop: 30,
        marginBottom: 15,
        paddingVertical: 5,
        paddingHorizontal: 30,
        justifyContent: "center",
        borderRadius: 10,
        marginHorizontal: 15,
    },
    btnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: '500',
    },
});