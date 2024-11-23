import React, { Component, useState, useEffect } from "react";
import {
    Text,
    View,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    ImageBackground,
    TextInput,
    TouchableHighlight,
    Button,
    Image,
    Alert,
    BackHandler
} from "react-native";
import { useIsFocused } from '@react-navigation/native';
//expo install expo-clipboard
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import Dialog from "react-native-dialog";
import ImageEvent from "../../../component/ImageEvent";

import { getAuth } from 'firebase/auth';
import firebase from '../../../config/Firebase';

export default function GuestEvJo({ route, navigation }) {

    const [visible, setVisible] = useState(false);

    const user = getAuth().currentUser;

    if (user !== null) {
        var uid = user.uid;
    }

    const eventId = route.params; // return object
    const isFocused = useIsFocused();

    console.log("Event ID: " + eventId.eid);

    const [inputPass, setInputPass] = useState([]);

    const [event, setEvent] = useState([]);

    //get event to show data
    async function getEvents() {
        let docRef = firebase.firestore().collection('events').doc(eventId.eid);

        docRef.get().then((querySnap) => {
            setEvent(querySnap.data());

        });
    }

    useEffect(() => {
        getEvents();

        const backAction = () => {
            navigation.popToTop();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove(), () => { setEvent([]); };
    }, [isFocused]);

    async function JoinEvent(eveID, userid) {

        if (event.eventPrivate === false) {

            let fireInput = firebase.firestore().collection('users').doc(userid).collection('eventjoin');

            // collector
            const addjoinevent = await fireInput.add({
                eventIdreplica: eveID,
                eventName: event.eventName,
                eventPicture: event.eventPicture,
                eventDes: event.eventDes,
                eventUid: event.eventUid,
            });

            try {
                navigation.navigate('GuestEventJoined', { eid: eveID });
            } catch (e) {
                console.log(e);
            }

        } else {
            setVisible(true);
        }


    }

    async function checkEvPass(passwd, userid, eveID) {

        setVisible(false);

        if (passwd === event.eventPass) {
            let fireInput = firebase.firestore().collection('users').doc(userid).collection('eventjoin');

            const addjoinevent = await fireInput.add({
                eventIdreplica: eveID,
                eventName: event.eventName,
                eventPicture: event.eventPicture,
                eventDes: event.eventDes,
                eventUid: event.eventUid,
            });

            navigation.navigate('GuestEventJoined', { eid: eveID });
        } else {
            alert("Invalid Password!");
        }
    }

    async function copyCode() {
        try {
            await Clipboard.setStringAsync(event.eventName);

        } catch (e) {
            console.log(e.message);
        }

    };

    return (
        <ImageBackground
            source={require("../../../assets/BG.png")}
            style={{
                flex: 1,
                width: null,
                height: null,
            }}
        >
            <SafeAreaView style={styles.container}>

                <View style={styles.eventNameSec}>
                    <Text style={styles.textNormal}>Event's Code: </Text>
                    <TextInput
                        style={[styles.textInput, { width: 230, borderRadius: 20 }]}
                        value={event.eventName}
                        editable={false}
                    />
                    <Ionicons name="copy" size={20} style={{ marginLeft: 5, marginBottom: 30 }}
                        onPress={copyCode}
                    />
                </View>

                <View style={styles.pictureSec}>
                    <View style={{ flexDirection: "row" }}></View>

                    <View style={{ width: '100%', height: 300, alignContent: 'center' }}>
                        <ImageEvent
                            img={event.eventPicture}
                        />
                        {/*                        <Image
                            source={{ uri: event.eventPicture }}
                            style={{ borderRadius: 10, width: 300, height: 200, marginLeft: 25 }}
        /> */}
                    </View>
                </View>
                <View style={styles.descSec}>
                    <Text
                        style={[
                            styles.textNormal,
                            { marginTop: -25, marginBottom: 10, marginLeft: "7%", marginRight: "5%" },
                        ]}
                    >
                        Description
                    </Text>
                    <View>
                        <TextInput
                            style={[
                                styles.descBox,
                                { marginLeft: "7%", marginRight: "5%", borderRadius: 5 },
                            ]}
                            multiline={true}
                            editable={false}
                            value={event.eventDes}
                        />
                    </View>
                </View>

                <View style={styles.btnSec}>
                    <TouchableHighlight
                        style={[
                            styles.btnViewPost,
                            { marginTop: -20, width: "80%", backgroundColor: "#30BD68", },
                        ]}
                        onPress={() => JoinEvent(eventId.eid, uid)}
                    >
                        <Text style={styles.btnText}>JOIN THIS EVENT</Text>
                    </TouchableHighlight>
                </View>

                <Dialog.Container visible={visible}>
                    <Dialog.Title>Event's Password</Dialog.Title>
                    <Dialog.Input label="Enter Password" onChangeText={(input) => setInputPass(input)}></Dialog.Input>
                    <Dialog.Button label="Cancel" onPress={() => setVisible(false)} />
                    <Dialog.Button label="Join" onPress={() => checkEvPass(inputPass, uid, eventId.eid)} />
                </Dialog.Container>

            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: StatusBar.currentHeight,
    },

    eventNameSec: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        width: 400,
    },

    pictureSec: {
        flex: 2,
        flexDirection: "column",
        width: 400,
        marginLeft:100,
    },

    descSec: {
        flex: 2,
        justifyContent: "center",
        width: 350,
        flexDirection: "column",
    },
    textNormal: {
        fontSize: 14,
        marginBottom: 30,
        color: 'white',
        fontWeight: 'bold',
    },
    btnSec: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        width: 400,

    },

    textInput: {
        color: "grey",
        height: 30,
        marginBottom: 30,
        borderColor: "black",
        borderWidth: 1,
        paddingLeft: 10,
        backgroundColor: "white",
    },

    descBox: {
        width: "85%",
        height: 100,
        borderRadius: 5,
        borderColor: "black",
        borderWidth: 1,
        backgroundColor: "white",
        padding: 10,
        textAlignVertical: "top",
    },

    btnViewPost: {
        width: "40%",
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: '#000',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 9,
    },

    btnText: {
        color: "white",
        fontWeight: "bold",
    },
});
