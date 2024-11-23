import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ImageBackground,
  TouchableOpacity
} from "react-native";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import firebase from "firebase/compat/app";
import firestore from '../../config/Firebase';

export default function ResetPassword() {
  const [email, setEmail] = useState('');

  async function ResetPass() {
    try {
      await firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
          // Signed in
          alert("an email has been sent !!");
          // ...
        })
        .catch((error) => {
          alert("problem with reset password");
          const errorCode = error.code;
          const errorMessage = error.message;

          // ..
        });
    } catch (error) {
      const errorMessage = error.message;
      alert(error);
    }
  }

  return (
    <ImageBackground
      source={require("../../assets/BG.png")}
      style={styles.container}
    >
      <View>
        <Text style={styles.textHeader}>Reset Password</Text>
        <StatusBar style="auto" />
        <TextInput
          placeholder="Email"
          style={styles.textInput}
          onChangeText={setEmail}
        />

        <View style={{ width: 300, marginTop: 10, marginLeft: 12 }}>

          <TouchableOpacity
            style={styles.buttonStyleLog}
            onPress={() => ResetPass()}
          >
            <Text style={styles.Textbt}>Send Email</Text>
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
    alignItems: "center",
    justifyContent: "center",
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
  textHeader: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
  },
  textInput: {
    color: "grey",
    height: 40,
    width: 300,
    marginTop: 40,
    marginLeft: 12,
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 1,
    padding: 10,
    backgroundColor: "white",
  },
  Textbt: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  }
});