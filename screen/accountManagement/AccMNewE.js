import React, { useState, useEffect } from 'react';
// import { TextInput } from 'react-native-web';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, TextInput } from 'react-native';

import firebase from '../../config/Firebase';
import 'firebase/compat/auth';
import { getAuth } from 'firebase/auth';

export default function ChangeEmail({ navigation }) {
  const [current, setcurrent] = useState("");
  const [newEmail, setnewEmail] = useState("");

  const user = getAuth().currentUser;

  if (user !== null) {
    var uid = user.uid;
  }

  // Reauthenticates the current user and returns a promise...
  function reauthenticate(current) { //ตรวจสอบผู้ใช้ปัจจุบัน
    let credential = firebase.auth.EmailAuthProvider.credential(
      currentUser.email,
    );
    return currentUser.reauthenticateWithCredential(credential);
  }

  // Changes user's email...
  function onChangeEmailPress() {
    if (newEmail != null) {

      firebase.firestore().collection('users').doc(uid).update({ email: newEmail }).then(() => console.log("Email Changed."));
      var user = firebase.auth().currentUser;
      user.updateEmail(newEmail).then(() => {
        alert("Email was changed");
      }, [navigation.goBack()])
        .catch((error) => { console.log(error.message); });
    } else { //check ค่าว่าง
      alert("Not Email");
    }
  }

  return (
    <ImageBackground source={require('../../assets/BG.png')} style={styles.container}>
      <View style={styles.boxdescription}>
        <Text style={styles.headerusertext}>New Email Address</Text>
        <TextInput style={[styles.name, styles.boxeditname]} placeholder=" Your New Email Address" onChangeText={setnewEmail}></TextInput>

      </View>

      <View style={styles.containerbutton}>
        <TouchableOpacity style={styles.buttoncancle} onPress={() => navigation.goBack()}>
          <Text style={styles.textother1}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonapply} onPress={() => onChangeEmailPress()}>
          <Text style={styles.textother1}>Apply</Text>
        </TouchableOpacity>
      </View>
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

  containerbutton: {
    marginTop: -10,
    marginBottom: 10,
    flexDirection: "row",
  },
  textother1: {
    fontSize: 16,
    fontWeight: "bold",
    color: 'white',
  },
  headerusertext: {
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 16,
    marginTop: 15,

  },
  buttoncancle: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3,
    width: 150,
    marginRight: 5,
    borderRadius: 30,
    backgroundColor: "#E30000",
  },
  buttonapply: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3,
    width: 150,
    marginLeft: 5,
    borderRadius: 30,
    backgroundColor: "#30BD68",
  },
  boxdescription: {
    width: 250,
    height: 130,
    marginTop: 10,
    borderRadius: 5,
  },
  boxeditname: {
    borderRadius: 5,
    width: 200,
    height: 40,
    marginTop: 5,
    marginLeft: 25,
    backgroundColor: "white"
  },
});