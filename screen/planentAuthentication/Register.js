import { StatusBar } from 'expo-status-bar';
// import { TextInput } from 'react-native-web';
import { StyleSheet, Text, View, Button, ImageBackground, TextInput,TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
// import { useFonts } from 'expo-font';
// import ChakraPetch from '../assets/fonts/ChakraPetch-Regular.ttf';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export default function Register({ navigation }) {
    const [username, setuserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cfpassword, setcfPassword] = useState('');

    async function UserRegister() {
        if (cfpassword == password) {
            await firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then((user) => {
                    alert('Success');

                    const currentUser = firebase.auth().currentUser;

                    console.log(user);
                    const db = firebase.firestore();

                    //บันทึก UID and User ลง Firestore
                    db.collection("users").doc(currentUser.uid).set({ name: username, email: email, picture: 'https://freesvg.org/img/abstract-user-flat-3.png' });

                }, [navigation.navigate('LoginScreen')])
                .catch((error) => {
                    alert(error.message);
                });

        } else {
            alert("Password doesn't match");
        }

    }
    return (
        <ImageBackground source={require('../../assets/BG.png')} style={styles.container}>
            <View>
                <Text style={styles.textHeader}>SIGN UP</Text>
                <StatusBar style="auto" />
                <TextInput placeholder="Username" style={styles.textInput} onChangeText={setuserName} />
                <TextInput placeholder="Email" style={styles.textInput} onChangeText={setEmail} />
                <TextInput placeholder="Password" style={styles.textInput}
                    secureTextEntry={true} onChangeText={setPassword} />
                <TextInput placeholder="Confirm Password" style={styles.textInput}
                    secureTextEntry={true} onChangeText={setcfPassword}
                />
                <View style={{ width: 300, marginTop: 40, marginLeft: 12 }}>
                    <TouchableOpacity  style={styles.buttonStyleRe} onPress={() => UserRegister()} >
                    <Text style={styles.Textbt}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: 'center',
        justifyContent: 'center',
        width: null,
        height: null,
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
    textHeader: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    textInput: {
        color: "grey",
        height: 40,
        width: 300,
        marginTop: 40,
        marginLeft: 12,
        borderRadius: 15,
        borderColor: 'black',
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'white',
    },
    Textbt: {
        fontSize: 18,
        color: "black",
        fontWeight: "bold",
      }
});