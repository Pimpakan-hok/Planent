import { StyleSheet, Text, View, ImageBackground, Button, TextInput, TouchableOpacity, LogBox } from 'react-native';
import * as React from 'react';
import { useState, useEffect } from 'react';

import ActionButton from 'react-native-circular-action-menu';
import Icon from 'react-native-vector-icons/Ionicons';

import { firebase } from "firebase/compat/app"
import firestore from '../../config/Firebase';
import 'firebase/compat/auth';

export default function Login({ navigation }) {

  //กำหนด state
  const [email, setEmail] = useState(''); //ค่าเริ่มต้น
  const [password, setPassword] = useState('');
  async function UserLogin() { //Code Connent firebase
    await firestore.auth().signInWithEmailAndPassword(email, password).then(() => {navigation.navigate('HomeScreen')})
      .catch((error) => {
        alert("Please Check your Email or Password!");
      });
  }

  useEffect(() =>{
    LogBox.ignoreLogs(['ViewPropTypes']);
  });

  return (
    <ImageBackground source={require('../../assets/BG.png')} style={styles.container}>
      <View>
        <Text style={styles.HeaderText}>PLANENT</Text>
        <Text style={styles.OURPad}>Email</Text>
        <TextInput
          style={styles.inputstyl} onChangeText={setEmail}
        />
        <Text style={styles.OURPad}>Password</Text>
        <TextInput secureTextEntry={true}
          style={styles.inputstyl} onChangeText={setPassword}
        />
        <Text
          style={styles.FGStyle}
          onPress={() => navigation.navigate('ForgetPassScreen')}>
          Forgot Password?
        </Text>
        <TouchableOpacity
          style={styles.buttonStyleLog}
          onPress={() => UserLogin()}
        >
          <Text style={styles.Textbt}>Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonStyleRe}
          onPress={() => navigation.navigate('RegisterScreen')}
        >
          <Text style={styles.Textbt}>Sign Up</Text>
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
  HeaderText: {
    fontSize: 60,
    margin: 10,
    color: "black",
    fontWeight: "bold",
    marginTop: 0
  },
  inputstyl: {
    backgroundColor: 'white',
    borderRadius: 15,
    height: 40,
    borderColor: 'black',
    paddingLeft: 20,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  OURPad: {
    padding: 10,
    fontWeight: "bold"
  },
  FGStyle: {
    padding: 10,
    marginLeft: 150,
    textDecorationLine: 'underline'
  },
  buttonStyleLog: {
    borderRadius: 15,
    backgroundColor: 'white',
    marginLeft: 18,
    height: 45,
    width: 260,

    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyleRe: {
    borderRadius: 15,
    backgroundColor: 'white',
    marginLeft: 18,
    height: 45,
    width: 260,
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',

  },
  Textbt: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  }
});