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
} from "react-native";
import { CheckBox } from "react-native-elements";
import { useState, useEffect } from "react";

//icon
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

//image picker
import * as ImagePicker from "expo-image-picker";

//import firebase ..
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import firebase from "firebase/compat/app";
import firestore from '../../config/Firebase';
import { NavigationContainer } from "@react-navigation/native";

export default function OwnerEditEventScreen({ navigation, route }) {
  const eventId = route.params;

  async function askPer() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Permission is not allowed !!");
    }
  }

  const [event, setEvent] = useState([]);

  //get event to set default values
  async function getEvents() {
    let docRef = firebase.firestore().collection("events").doc(eventId.eid);

    await docRef.get().then((querySnap) => {
      const tempDoc = querySnap.data();
      setEvent(tempDoc);
      setDefaultValue(tempDoc);
    });

  }

  const [checkBoxPrivate, setCheckBoxPrivate] = useState(false);
  const [image, setImage] = useState();
  const [pic, setPic] = useState();
  const [evName, setEvName] = useState("");
  const [evDes, setEvDes] = useState("");
  const [evPass, setEvPass] = useState("");

  function setDefaultValue(event) {
    setEvName(event.eventName);
    setEvDes(event.eventDes);
    setEvPass(event.eventPass);
    setCheckBoxPrivate(event.eventPrivate);
    setImage(event.eventPicture);
    setPic(event.eventPicture);
  }

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function checkLogin() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          setCurrentUser(user.uid);
        }
      });
    }
    checkLogin();
    askPer();
    getEvents();

    return checkLogin, askPer, getEvents, () => {setDefaultValue([]); setEvent([]);};
  }, []);

  const takePhoto = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      let response = await fetch(result.uri);
      let blob = await response.blob();

      var filename = (`EventPhoto/${Date.now()}`).toString(36); + ".jpg";

      var storageRef = firebase.storage().ref();
      var imgRef = storageRef.child(filename);

      await imgRef
        .put(blob)
        .then((snap) => {
          alert("Uploaded !");
        })
        .catch((error) => alert(error.message));

      //get img url
      const url = await imgRef.getDownloadURL();
      setPic(url);
    }
  };

    const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    //generate filename
    var filename = (`EventPhoto/${Date.now()}`).toString(36); + ".jpg";

    if (!result.cancelled) {
      setImage(result.uri);
      let response = await fetch(result.uri);
      let blob = await response.blob();

      var storageRef = firebase.storage().ref();
      var imgRef = storageRef.child(filename);

      await imgRef
        .put(blob)
        .then((snap) => {
          alert("Uploaded !");
        })
        .catch((error) => alert(error.message));

      //get img url
      const url = await imgRef.getDownloadURL();
      setPic(url);
    }
  };

  //function update Event to database
  async function updateToDatabase() {
    let collRef = firebase.firestore().collection("events").doc(eventId.eid);

    const updatedEvent = await collRef.update({
      eventName: evName,
      eventPicture: pic,
      eventDes: evDes,
      eventPrivate: checkBoxPrivate,
      eventPass: checkBoxPrivate ? evPass : "",
      eventPrivateText: checkBoxPrivate ? "https://cdn-icons-png.flaticon.com/512/891/891399.png" : "https://cdn-icons.flaticon.com/png/512/2061/premium/2061813.png?token=exp=1655134841~hmac=bb518921122943fe417b1c6c274e4e6f",
    });
    return eventId.eid;
  }

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
            style={[styles.textInput, {width: 230, borderRadius: 20 ,marginBottom:30 }]}
            onChangeText={setEvName}
            defaultValue={event.eventName}
          />
        </View>

        <View style={styles.pictureSec}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.textNormal1, {  marginLeft: 39 , marginBottom:10 }]}>
              Insert Picture :
            </Text>
            <Ionicons
              name="camera"
              size={24}
              color="black"
              style={{ marginLeft: 20 , marginTop:-15}}
              onPress={takePhoto}
            />
            <Ionicons
              name="image"
              size={24}
              color="black"
              style={{ marginLeft: 20 , marginTop:-15}}
              onPress={pickImage}
            />
          </View>

          <View style={{ borderRadius: 10, width: 300, height: 200 ,marginLeft:50 }}>
            {image && (
              <Image
                source={{ uri: image }}
                style={{ borderRadius: 10, width: 300, height: 201 ,marginTop:15 }}
              />
            )}
          </View>
        </View>

        <View style={styles.descSec}>
          <Text
            style={[
              styles.textdes,
              { marginBottom: 10, marginLeft: "6%", marginRight: "5%" },
            ]}
          >
            Description
          </Text>
          <TextInput
            style={[
              styles.descBox,
              { marginLeft: "7%", marginRight: "5%", borderRadius: 5 },
            ]}
            multiline={true}
            onChangeText={setEvDes}
            defaultValue={event.eventDes}
          />
        </View>

        <View style={styles.privateSec}>
          <View
            style={{
              width: "100%",
              height: "55%",
              alignItems: "center",
              flexDirection: "row",
              marginLeft: "10%",
              marginTop: 10
            }}
          >
            <CheckBox
              checked={checkBoxPrivate}
              onPress={() => setCheckBoxPrivate(!checkBoxPrivate)}
              checkedColor='white'
            />
            <Text style={styles.textprive}>Private</Text>
          </View>
          <View
            style={{
              width: "100%",
              height: "45%",
              justifyContent: "center",
              marginLeft: "10%",
            }}
          >
            <TextInput
              style={[styles.textInput, {width: "80%" ,marginBottom:40 , borderRadius:10 ,marginLeft:20 }]}
              placeholder="Type your password"
              onChangeText={setEvPass}
              defaultValue={event.eventPass}
            ></TextInput>
          </View>
        </View>

        <View style={styles.btnSec}>
          <TouchableHighlight
            style={styles.btnApply}
            onPress={() =>
              updateToDatabase().then((eid) =>
                navigation.navigate("OwnerViewEvent", { eid })
              )
            }
          >
            <Text style={styles.btnText}>APPLY</Text>
          </TouchableHighlight>
        </View>
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
  textdes: {
    fontSize: 14,
    marginTop:40,
    color:'white',
    fontWeight: 'bold',
  
  },
  eventNameSec: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: 400,
  },
  textprive: {
    fontSize: 14,
    marginTop:0,
    color:'white',
    fontWeight: 'bold',
  
  },
  pictureSec: {
    flex: 4,
    flexDirection: "column",
    width: 400,
  },

  descSec: {
    flex: 2.5,
    justifyContent: "center",
    width: 350,
    flexDirection: "column",
  },

  privateSec: {
    flex: 1.7,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: 400,
    flexWrap: "wrap",
  },

  btnSec: {
    flex: 1.7,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: 400,
  },

  textInput: {
    color: "grey",
    height: 30,
    borderColor: "black",
    borderWidth: 1,
    paddingLeft: 10,
    backgroundColor: "white",
  },
  textNormal1: {
    fontSize: 14,
    marginTop:-10,
    color:'white',
    fontWeight: 'bold',
  
  },
  textNormal: {
    fontSize: 14,
    marginBottom:30,
    color:'white',
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

  btnApply: {
    width: "75%",
    height: 40,
    backgroundColor: "#30BD68",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -30,
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

  