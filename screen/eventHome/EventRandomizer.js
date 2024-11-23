import { Text, View, StyleSheet, TouchableHighlight, NavigatorIOS, ScrollView, FlatList, ImageBackground } from 'react-native';
import Constants from 'expo-constants';
import React, { useState, useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';
import 'react-native-unimodules';

import { getAuth } from 'firebase/auth';
import firebase from '../../config/Firebase';
import { render } from 'react-dom';
import Dialog from "react-native-dialog";

export default function Shakesensor({ navigation }) {

    const [visible, setVisible] = useState(false);

    const user = getAuth().currentUser;

    if (user !== null) {
        var uid = user.uid;
    }

    const [sensor, setSensor] = useState(false);
    const [shake, setShake] = useState(false);
    const [shakeText, setShakeText] = useState('The sensor is off. Press the button to turn it on.');

    const [firedata, setFiredata] = useState([]);

    const [endedata, setEndedata] = useState([]);

    const [joeddata, setJoeddata] = useState([]);

    const [ranID, setRanID] = useState([]);

    async function endedLoad() {
        try {
            let firecall = firebase.firestore().collection('events').where("eventState", '==', "ended");

            await firecall.onSnapshot(snapshot => {
                const endedID = [];

                snapshot.forEach(docSnap => {
                    endedID.push(docSnap.id);
                });
                setEndedata(endedID);
            });
        } catch (e) {
            console.log("joedLoad error: " + e);
        }
    }

    async function joedLoad() {
        try {
            let firecall = firebase.firestore().collection('users').doc(uid).collection('eventjoin');

            await firecall.onSnapshot(snapshot => {
                const evidJo = [];

                snapshot.forEach(docSnap => {
                    evidJo.push(docSnap.data().eventIdreplica);
                });
                setJoeddata(evidJo);
            });
        } catch (e) {
            console.log("joedLoad error: " + e);
        }
    }

    async function dataLoad() {
        try {
            let firedataload = firebase.firestore().collection('events').where("eventUid", '!=', uid);

            await firedataload.onSnapshot(querySnap => {
                const firedata = [];

                querySnap.forEach((documentSnap) => {
                    firedata.push(documentSnap.id);
                });
                setFiredata(firedata);

            });
        } catch (e) {
            console.log("dataLoad error: " + e);
        }
    }

    function checker(a) {
        return joeddata.indexOf(a) < 0 && endedata.indexOf(a) < 0;
    }

    useEffect(() => {
        endedLoad();
        joedLoad();
        dataLoad();


        return () => { setFiredata([]); setJoeddata([]); setEndedata([]); };
    }, []);

    // useEffect(() => {
    //     const fireloader = firebase.firestore().collection('events').doc(ranID).get().then((snapshot) => {
    //         setOwnerUid(
    //             snapshot.data().eventUid
    //         );
    //     });
    // }, []);

    // let collRef = firestore.collection('events');

    // await collRef.get().then((querySnap) => {
    //     let nameArray = [];
    //     querySnap.forEach((doc) => {
    //         nameArray.push(doc.id);
    //     })

    //     console.log(nameArray);
    // });

    const addSensorListener = (handler) => {
        //this is shake sensitivity - lowering this will give high sensitivity and increasing this will give lower sensitivity
        if (sensor) {
            console.log('sensor is on');
            const sensibility = 2.5;  //ตรวจความไวต่อการสั่น ถ้าเลขต่ำความไวต่อการสั่นจะสูง ถ้าเลขสูงความไวต่อการสั่นจะต่ำ
            //let last_x, last_y, last_z;
            // let lastUpdate = 0;
            Accelerometer.setUpdateInterval(100); // update value every 100ms.
            Accelerometer.addListener((accelerometerData) => {
                let { x, y, z } = accelerometerData; //แกนโทรศัพท์
                /*let currTime = Date.now();
                if (currTime - lastUpdate > 100) {
                    let diffTime = currTime - lastUpdate;
                    lastUpdate = currTime;*/
                // Adjust sensibility, because it can depend of usage (& devices)
                let acceleration = Math.sqrt(x * x + y * y + z * z); // คำนวณค่าความเร่ง
                if (acceleration > sensibility) {
                    handler(acceleration);
                    setShake(true);
                    console.log('shake');
                    try {
                        

                        let result = firedata.filter(checker);

                        firedata.forEach(element => {
                            console.log("Default: " + element);
                        });

                        endedata.forEach(element => {
                            console.log("Ended: " + element);
                        });

                        joeddata.forEach(element => {
                            console.log("Joined: " + element);
                        });

                        result.forEach(element => {
                            console.log("Filtered: " + element);
                        });

                        var randomID = result[Math.floor(Math.random() * result.length)]; //array

                        console.log("Random Result: " + randomID);
                        
                        if (randomID === undefined) {
                            setSensor(!sensor); changeText(!sensor); setShake(false);
                            setVisible(true);
                        } else {
                            setSensor(!sensor); changeText(!sensor); setShake(false);
                            navigation.navigate('GuestEvent', { eid: randomID });
                        }

                    } catch (e) {
                        console.log(e);
                    }

                } else {
                    setShake(false);
                    // console.log('not shake');
                }

                /*last_x = x;
                last_y = y;
                last_z = z;*/

            });
        } else {
            console.log('sensor is off');
        }

    };

    const removeListener = () => {
        Accelerometer.removeAllListeners();
    };

    useEffect(() => {
        addSensorListener(() => {
            //console.log("shake with acceleration " + speed);
        });
        return () => {
            removeListener();
        };
    });

    function changeText(val) {
        if (val) {
            setShakeText('The sensor is on');
        } else {
            setShakeText('The sensor is off. Press the button to turn it on.');
        }
    }

    return (
        <ImageBackground source={require('../../assets/BG.png')} style={styles.container}>

            <View>
                <Text style={{ fontSize: 25, marginLeft: 85, color: 'white', fontWeight: 'bold', marginBottom: 50 }}>RANDOM EVENT</Text>
                <Text style={styles.text}>{shakeText}</Text>
                <Text style={styles.text}></Text>
                <TouchableHighlight style={{ marginLeft: 0, width: 350, height: 40, backgroundColor: "#210E9A", alignItems: 'center', justifyContent: 'center', borderRadius: 10 }} onPress={() => { setSensor(!sensor); changeText(!sensor); setShake(false); }}>
                    <Text style={styles.text}>Random</Text>
                </TouchableHighlight>
            </View>
            <Dialog.Container visible={visible}>
                    <Dialog.Title>No Events to Random!</Dialog.Title>
                    <Dialog.Button label="OK" onPress={() => navigation.goBack()} />
                </Dialog.Container>
        </ImageBackground>

    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: null,
        height: null,
    },
    text: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white'
    },
});
