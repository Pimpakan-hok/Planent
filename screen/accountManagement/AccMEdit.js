import React, { useState, useEffect } from 'react';
// import { TextInput } from 'react-native-web';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, TextInput, TouchableHighlight } from 'react-native';
import * as ImagePicker from "expo-image-picker";

import { NavigationContainer, useIsFocused } from '@react-navigation/native';

import { getAuth } from 'firebase/auth';
import firebase from '../../config/Firebase';
import { MaterialCommunityIcons } from '@expo/vector-icons';
export default function ChangeProfile({ navigation }) {

  const isFocused = useIsFocused();

  const user = getAuth().currentUser;
  const [name, setName] = useState('');
  const [pic, setPic] = useState(null);
  const [img, setImg] = useState(null);
  const [editPic, setEditPic] = useState(false);
  const [userInfo, setUserInfo] = useState({ infoName: '', infoPic: null })

  if (user !== null) {
    var email = user.email;
    var uid = user.uid;
  }

  useEffect(() => {
    const firecall = firebase.firestore().collection('users').doc(uid).get().then((snapshot) => {
      if (snapshot.data().picture === null || snapshot.data().picture === undefined) {
        setUserInfo({ infoName: snapshot.data().name, infoPic: 'https://freesvg.org/img/abstract-user-flat-3.png' });
      } else {
        setUserInfo({ infoName: snapshot.data().name, infoPic: snapshot.data().picture });
      }

    });
  }, [isFocused]);

  const [newname, setNewname] = useState('');
  const [editName, setEditName] = useState(false);

  async function editAccState(val) {
    setNewname(val);
    setEditName(true);
  }

  //newname !== null && newname !== '' && newname !== ' ' && newname !== []

  async function setUserName(inputname) {
    if (newname !== null && newname !== '' && newname !== ' ') {
      const userRef = firebase.firestore().collection('users').doc(uid).update({ name: inputname, picture: userInfo.infoPic }).then(() => navigation.navigate('AccMMain'));
    } else if (editName !== true) {
      const userRef = firebase.firestore().collection('users').doc(uid).update({ name: userInfo.infoName, picture: userInfo.infoPic }).then(() => navigation.navigate('AccMMain'));
    } else {
      alert("You cannot apply without input.");
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    var filename = (`UserPhoto/${Date.now()}`).toString(36); + ".jpg";

    if (!result.cancelled) {
      setEditPic(true);
      setImg(result.uri);
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

      const url = await imgRef.getDownloadURL();
      setUserInfo({ ...userInfo, infoPic: url });
    }
  };

  //(val) => editAccState(val)

  return (
    <ImageBackground source={require('../../assets/BG.png')} style={styles.container}>
      <View>
        <Image style={styles.avatar} source={{ uri: editPic ? img : userInfo.infoPic }} />
        <TouchableOpacity onPress={() => pickImage()}>

          <Image source={require('../../assets/pencil.png')} style={styles.pencil} />

        </TouchableOpacity>

      </View>

      <View style={styles.boxdescription}>
        <Text style={styles.headerusertext}>Username</Text>
        <TextInput style={[styles.name, styles.boxeditname]} defaultValue={userInfo.infoName} placeholder={userInfo.infoName} onChangeText={(val) => editAccState(val)}></TextInput>
        <Text style={styles.headerusertext}>Email</Text>
        <Text style={styles.email}>{email}</Text>

      </View>
      <TouchableOpacity style={styles.buttonchangepw} onPress={() => navigation.navigate('ChangePassword')}>
        <Text style={styles.textother}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonchangeemail} onPress={() => navigation.navigate('ChangeEmail')}>
        <Text style={styles.textother}>Change Email</Text>
      </TouchableOpacity>
      <View style={styles.containerbutton}>
        <TouchableOpacity style={styles.buttoncancle} onPress={() => navigation.goBack()}>
          <Text style={styles.textother1}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonapply} onPress={() => setUserName(newname)}>
          <Text style={styles.textother1}>Apply</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
// Hello Planent
//123
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
    marginTop: 10,
    flexDirection: "row",
  },
  pencil: {
    width: 35,
    height: 35,
    borderRadius: 63,
    borderColor: "white",
    borderWidth: 2,
    position: 'absolute',
    alignSelf: 'center',
    bottom: 240
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 100,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: -400
  },
  email: {
    fontSize: 14,
    marginTop: 5,
    marginLeft: 25,
    fontWeight: "bold",
  },
  name: {
    fontSize: 14,
    marginTop: 5,
    marginLeft: 20,
  },
  textother: {
    fontSize: 16,
    fontWeight: "bold",
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
  buttonchangepw: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: -10,
    width: 200,
    borderRadius: 30,
    backgroundColor: "white",
  },
  buttonchangeemail: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: -300,
    width: 200,
    borderRadius: 30,
    backgroundColor: "white",
  },
  buttoncancle: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 400,
    marginBottom: -500,
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
    marginTop: 400,
    marginBottom: -500,
    width: 150,
    marginLeft: 5,
    borderRadius: 30,
    backgroundColor: "#30BD68",
  },
  boxdescription: {
    width: 250,
    height: 130,
    marginTop: -250,
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