import React, { useState, useEffect } from 'react';
// import { TextInput } from 'react-native-web';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, TextInput } from 'react-native';
import firebase from '../../config/Firebase';
import 'firebase/compat/auth';

export default function ChangePW({navigation}) {
  const [newpw, setnewpw] = useState('');
  const [currentpw, setcurrentpw] = useState('');
  const [cfpw, setcfpw] = useState('');
  // Reauthenticates the current user and returns a promise...
function reauthenticate (currentpw) {
  let credential = firebase.auth.EmailAuthProvider.credential(
    currentpw.email,
  );
   return currentpw.reauthenticateWithCredential(credential);
 }
  // Changes user's password...

  function onChangePasswordPress () {
    if(cfpw == newpw){
      var user = firebase.auth().currentUser;
      user.updatePassword(newpw).then(() => {
      alert("Password was changed");
      },[navigation.goBack()]).catch((error) => { console.log(error.message); });
    }else if(cfpw != newpw){
      alert("Password doesn't match");
    }

}
  return (
    <ImageBackground source={require('../../assets/BG.png')} style={styles.container}>
        <View style={styles.boxdescription}>
      
          <Text style={styles.headerusertext}>New Password</Text>
          <TextInput style={[styles.name, styles.boxeditname]} placeholder=" Your Password" onChangeText={setnewpw} secureTextEntry={true}></TextInput>
          <Text style={styles.headerusertext}> Confirm New Password</Text>
          <TextInput style={[styles.name, styles.boxeditname]} placeholder=" Confirm New Password" onChangeText={setcfpw} secureTextEntry={true}></TextInput>
        </View>

        <View style={styles.containerbutton}>
          <TouchableOpacity style={styles.buttoncancle} onPress={() => navigation.goBack()}>
            <Text style={styles.textother1}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonapply} onPress={() => onChangePasswordPress ()  }>
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
    marginTop: 100,
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
    marginTop: 100,
    width: 150,
    marginLeft: 5,
    borderRadius: 30,
    backgroundColor: "#30BD68",
  },
  boxdescription: {
    width: 250,
    height: 150,
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