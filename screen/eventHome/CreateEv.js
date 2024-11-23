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
  TouchableOpacity,
  Image,
  Platform,
  BackHandler
} from "react-native";
import { CheckBox } from "react-native-elements";
import { useState, useEffect } from "react";


//icon
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

//image picker
import * as ImagePicker from "expo-image-picker";

//import firebase ..
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { getAuth } from 'firebase/auth';
import firebase from "firebase/compat/app";
import { NavigationContainer } from "@react-navigation/native";

export default function CreateEventScreen({ navigation }) {
  const [checkBoxPrivate, setCheckBoxPrivate] = useState(false);
  const [checkBoxGuest, setCheckBoxGuest] = useState(false);

  const [udata, setUdata] = useState([]);

  async function askPer() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Permission is not allowed !!");
    }
  }

  const user = getAuth().currentUser;

  if (user !== null) {
    var currentUser = user.uid;
  }

  // const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    let usercall = firebase.firestore().collection('users').doc(currentUser);

    usercall.get().then((snapshot) => {
      setUdata({
        name: snapshot.data().name,
        picture: snapshot.data().picture,
      });
    });

    askPer();

    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const [image, setImage] = useState(null);
  const [pic, setPic] = useState(null);

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

  // set value
  const [evName, setEvName] = useState("");
  const [evDes, setEvDes] = useState("");
  const [evPass, setEvPass] = useState("");
  const [guestNum, setGuestNum] = useState("");

  //function insert Event to database
  async function insertToDatabase() {
    let collRef = firebase.firestore().collection("events");

    const addedEvent = await collRef.add({
      eventName: evName,
      eventPicture: pic,
      eventDes: evDes,
      eventPrivate: checkBoxPrivate,
      eventPass: checkBoxPrivate ? evPass : "",
      eventPrivateText: checkBoxPrivate ? "https://cdn-icons-png.flaticon.com/512/891/891399.png" : "https://cdn-icons.flaticon.com/png/512/2061/premium/2061813.png?token=exp=1655134841~hmac=bb518921122943fe417b1c6c274e4e6f",
      eventGuest: checkBoxGuest,
      eventGuestNum: checkBoxGuest ? guestNum : "",
      eventState: "preparation",
      eventUid: currentUser,
    });
    const addedEventId = addedEvent.id;

    await collRef.doc(addedEventId).update({
      eventIDreplica: addedEventId,
    })

    const genesispost = await collRef.doc(addedEventId).collection('posts').add({
      picture: pic,
      des: "Welcome to " + evName,
      postUid: currentUser,
      username: udata.name,
      userpicture: udata.picture,
    });

    return addedEventId;
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
            style={[styles.textInput, { width: 230, borderRadius: 20, marginBottom: 30 }]}
            onChangeText={setEvName}
          />
        </View>

        <View style={styles.pictureSec}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.textNormal1, { marginLeft: 39, marginBottom: 10 }]}>
              Insert Picture :
            </Text>
            <Ionicons
              name="camera"
              size={24}
              color="black"
              style={{ marginLeft: 20, marginTop: -15 }}
              onPress={takePhoto}
            />
            <Ionicons
              name="image"
              size={24}
              color="black"
              style={{ marginLeft: 20, marginTop: -15 }}
              onPress={pickImage}
            />
          </View>

          <View style={{ backgroundColor: 'white', borderRadius: 10, width: 300, height: 200, marginLeft: 50 }}>
            <Text style={styles.textother2}>ยังไม่มีรูป</Text>
            <Image
        source={{ uri: image }}
        style={{ borderRadius: 10, width: 300, height: 201, marginTop: -112 }}
      />
          </View>
        </View>

        <View style={styles.descSec}>
          <Text
            style={[
              styles.textdes,
              { marginBottom: 0, marginLeft: "6%", marginRight: "5%" },
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
          />
        </View>

        <View style={styles.privateSec}>
          <View
            style={{
              width: "100%",
              height: "60%",
              alignItems: "center",
              flexDirection: "row",
              marginLeft: "15%",
              marginTop: 5
            }}
          >
            <CheckBox
              checked={checkBoxPrivate}
              onPress={() => setCheckBoxPrivate(!checkBoxPrivate)}
              checkedColor='white'
              style={{ marginTop: 10}}
            />
            <Text style={styles.textprive}>Private</Text>
          </View>
          <View
            style={{
              width: "95%",
              height: "30%",
              justifyContent: "center",
              marginLeft: "10%",

            }}
          >
            <TextInput
              style={[styles.textInput, { width: "80%", borderRadius: 10, margin: 10 }]}
              placeholder="Type your password"
              onChangeText={setEvPass}
            ></TextInput>
          </View>
        </View>

        <View style={styles.guestSec}>
        </View>

        <View style={styles.btnSec}>
          <TouchableHighlight
            style={styles.btnCreate}
            onPress={() =>
              insertToDatabase().then((eid) =>
                navigation.navigate("OwnerViewEvent", { eid })
              )
            }
          >
            <Text style={styles.btnText}>CREATE</Text>
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

  eventNameSec: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: 400,
  },
  textNormal: {
    fontSize: 14,
    marginBottom: 30,
    color: 'white',
    fontWeight: 'bold',

  },
  textNormal1: {
    fontSize: 14,
    marginTop: -10,
    color: 'white',
    fontWeight: 'bold',

  },
  textprive: {
    fontSize: 14,
    marginTop: 0,
    color: 'white',
    fontWeight: 'bold',

  },
  textdes: {
    fontSize: 14,
    marginTop: 40,
    color: 'white',
    fontWeight: 'bold',

  },
  textother2: {
    fontSize: 16,
    fontWeight: "200",
    marginLeft: 120,
    marginTop: 90,
  },
  pictureSec: {
    flex: 4,
    flexDirection: "column",
    width: 400,
  },

  descSec: {
    flex: 3,
    justifyContent: "center",
    width: 350,
    flexDirection: "column",
  },

  privateSec: {
    flex: 1.7,
    alignItems: "center",
    justifyContent: "center",
    width: 400,
    flexWrap: "wrap",
  },

  guestSec: {
    flex: 1.2,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    width: 400,
  },

  btnSec: {
    flex: 0.8,
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

  btnCreate: {
    width: "75%",
    height: 40,
    backgroundColor: "#30BD68",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -70,
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

