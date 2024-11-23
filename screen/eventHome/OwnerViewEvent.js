import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  TextInput,
  TouchableHighlight,
  Image,
  BackHandler,
  DevSettings
} from "react-native";
import { CheckBox } from "react-native-elements";
import { useIsFocused } from '@react-navigation/native';
import { useState, useEffect } from "react";
import Dialog from "react-native-dialog";

//icon
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
//image picker
import * as ImagePicker from "expo-image-picker";
import ActionButton from 'react-native-circular-action-menu';
import ImageEvent from "../../component/ImageEvent";

//import firebase ..
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import firebase from "firebase/compat/app";
import firestore from '../../config/Firebase';
import { NavigationContainer } from "@react-navigation/native";

export default function OwnerViewEvent({ navigation, route }) {
  const eventId = route.params; // return object
  const isFocused = useIsFocused();

  const [visible, setVisible] = useState(false);

  const eventIdArray = Object.values(eventId); //event id to array
  const eid = eventIdArray.toString(); //eventarray to string

  const [event, setEvent] = useState([]);

  const [StateCaller, setStateCaller] = useState([]);

  const [stateText, setStateText] = useState([]);

  async function ChangeEventState() {
    let statecall = firebase.firestore().collection('events').doc(eventId.eid);

    await statecall.get().then((snapshot) => {
      setStateCaller(snapshot.data().eventState);
    });

    if (StateCaller === 'preparation') {
      await statecall.update({
        eventState: "started"
      });
      navigation.navigate('PostList', { eid });
    } else {
      await statecall.update({
        eventState: "ended"
      });
      navigation.goBack();
    }
  }

  async function StateText(s) {
    if (s === 'preparation') {
      setStateText("Start");
    } else if (s === 'started') {
      setStateText("End");
    } else if (s === 'ended') {
      setStateText("Event Ended");
    }

    return () => { setStateText([]); };
  }

  //get event to show data
  async function getEvents() {
    let docRef = firebase.firestore().collection('events').doc(eventId.eid);

    const firecall = await docRef.get().then((querySnap) => {
      setEvent(querySnap.data());
      StateText(querySnap.data().eventState);
    });

    return () => { setEvent([]); };
  };

  async function deleteEvent() {
    setVisible(false);
    let docRef = firebase.firestore().collection('events').doc(eventId.eid);
    const res = await docRef.delete().then(() => navigation.popToTop())

    return res;
  };

  useEffect(() => {
    getEvents();
    //StateText();

    const backAction = () => {
      navigation.popToTop();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(), () => { setEvent([]); setStateText([]); };
  }, [isFocused]);

  const [showBox, setShowBox] = useState(true);

  return (
    <ImageBackground
      source={require("../../assets/BG.png")}
      style={{
        flex: 1,
        width: null,
        height: null,
      }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.eventNameSec}>
          <Text style={styles.textNormal}>Event's Name: </Text>
          <TextInput
            style={[styles.textInput, { width: 230, borderRadius: 20 }]}
            value={event.eventName}
            editable={false}
          />
        </View>

        <View style={styles.pictureSec}>

          <View style={{ width: '100%', height: 300, alignContent: 'center'}}>
          <ImageEvent
                img={ event.eventPicture }
               />
            {/*            <Image
              source={{ uri: event.eventPicture }}
              style={{ borderRadius: 10, width: 300, height: 200, marginLeft: 15, marginTop: -20 }}
             /> */}

          </View>
        </View>
        <View style={styles.descSec}>
          <Text
            style={[
              styles.textNormal,
              { marginTop: -30, marginLeft: "5%", marginRight: "5%" },
            ]}
          >
            Description
          </Text>
          <View>
            <TextInput
              style={[
                styles.descBox,
                { marginLeft: "5%", marginRight: "5%", borderRadius: 5, marginTop: -40 },
              ]}
              multiline={true}
              editable={false}
              value={event.eventDes}
            />
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <CheckBox checked={event.eventPrivate} style={{ marginTop: 15 }} checkedColor='white' />
              <Text style={[styles.textNormal, { marginTop: 15 }]}>Private</Text>
            </View>
          </View>
        </View>

        <View style={styles.btnSec}>
          <TouchableHighlight
            style={[
              styles.btnViewPost,
              { width: "80%", backgroundColor: "#210E9A", marginLeft: 10 ,marginTop:-50},
            ]}

            onPress={() => navigation.navigate('PostList', { eid })}
          >
            <Text style={styles.btnText}>VIEW POST</Text>


          </TouchableHighlight>

        </View>


        <TouchableHighlight
          style={[
            styles.btnViewPost,
            { width: "45%", backgroundColor: "#37B48E", marginTop: -5, marginLeft: 20 },
          ]}
          onPress={() => ChangeEventState()}
        >
          <Text style={styles.btnText}>{stateText}</Text>
        </TouchableHighlight>

        {/* ปุ่มกลมๆ */}
        <View style={{ flex: 1, backgroundColor: '#f3f3f3', marginLeft: '80%' }}>
          <ActionButton buttonColor="rgba(106,90,205,1)" position="right">
            <ActionButton.Item buttonColor='#3498db' title="Delete" onPress={() => setVisible(true)}>
              <FontAwesome name="trash" size={15} color="white" />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#9b59b6' title="Edit Event" onPress={() => navigation.navigate("OwnerEditEvent", { eid })}>
              <Ionicons name="pencil" size={20} color="white" />
            </ActionButton.Item>
          </ActionButton>
        </View>
        {/* ปุ่มกลมๆ */}


      </SafeAreaView>

      <Dialog.Container visible={visible}>
        <Dialog.Title>Delete this event?</Dialog.Title>
        <Dialog.Button label="Cancel" onPress={() => setVisible(false)} />
        <Dialog.Button label="Delete" onPress={() => deleteEvent()} />
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
    
    height: '10%',
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: 380,
    marginTop: 30,
  },

  pictureSec: {
    marginBottom: 25,
    height: '35%',
    flexDirection: "column",
    width: '100%',
    alignContent: 'center',
    marginLeft:63,
  },

  descSec: {
    height: '30%',
    justifyContent: "center",
    width: 350,
    flexDirection: "column",
  },

  btnSec: {
    height: '20%',
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: 380,
    margin: -45,
  },
  btnSec1: {
    height: '20%',
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: 380,
  },

  textInput: {
    color: "grey",
    height: 30,
    borderColor: "black",
    borderWidth: 1,
    paddingLeft: 10,
    backgroundColor: "white",
    marginBottom: 45
  },

  textNormal: {
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 45
  },

  descBox: {
    width: "90%",
    height: 100,
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 1,
    backgroundColor: "white",
    padding: 10,
    textAlignVertical: "top",
    color: "grey",

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
