import * as React from 'react';
import { Text, View, StyleSheet, BackHandler } from 'react-native';
import Constants from 'expo-constants';

// You can import from local files
import {
  StatusBar,
  SafeAreaView,
  ImageBackground,
  TextInput,
  TouchableHighlight,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
//expo install expo-clipboard
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import ImageEvent from "../../../component/ImageEvent";

import Dialog from "react-native-dialog";

import { getAuth } from 'firebase/auth';
import firebase from '../../../config/Firebase';

export default function GuestEvJoed({ navigation, route }) {
  const eventId = route.params;

  const [visible, setVisible] = useState(false);

  const user = getAuth().currentUser;

  if (user !== null) {
    var uid = user.uid;
  }

  const [event, setEvent] = useState([]);

  //get event to show data
  async function getEvents() {
    let docRef = firebase.firestore().collection("events").doc(eventId.eid);

    const firecall = await docRef.get().then((querySnap) => {
      if (querySnap.exists) {
        setEvent(querySnap.data());
      } else {
        setEvent({
          eventName: "Deleted",
          eventPicture: "Deleted",
          eventDes: "Deleted",
          eventPrivate: "Deleted",
          eventPass: "Deleted",
          eventPrivateText: "Deleted",
          eventGuest: "Deleted",
          eventGuestNum: "Deleted",
          eventState: "Deleted",
          eventUid: "Deleted",
        });
        setVisible(true);
      }
    });

    return () => firecall();
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

    return () => backHandler.remove();
  }, []);

  //delete event from guest
  async function leaveEvent(evid) {
    const fireleave = await firebase.firestore().collection('users').doc(uid).collection('eventjoin').where("eventIdreplica", '==', evid)
      .get().then(function (quesnap) {
        quesnap.forEach(function (doc) {
          doc.ref.delete();
        })
      });
    navigation.popToTop();

    return fireleave;
  };

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
              styles.btn,
              { marginTop: -20, width: "80%", backgroundColor: "#002167" },
            ]}
            onPress={() => navigation.navigate('PostList', { eid: eventId.eid })}
          >
            <Text style={styles.btnText}>VIEW POST</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={[
              styles.btn,
              { marginTop: -20, width: "80%", backgroundColor: "#CF0000", marginTop: 10 },
            ]}
            onPress={() => leaveEvent(eventId.eid)}
          >
            <Text style={styles.btnText}>LEAVE</Text>
          </TouchableHighlight>
        </View>
      </SafeAreaView>

      <Dialog.Container visible={visible}>
        <Dialog.Title>Event Deleted!</Dialog.Title>
        <Dialog.Button label="OK" onPress={() => leaveEvent(eventId.eid)} />
      </Dialog.Container>
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

  btnSec: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
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

  textNormal: {
    fontSize: 14,
    marginBottom: 30,
    color: 'white',
    fontWeight: 'bold',
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
  btn: {
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


