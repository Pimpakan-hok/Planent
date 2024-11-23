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
} from "react-native";

import { useState, useEffect } from "react";
import { Card } from 'react-native-paper';

//icon
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
//image picker
import * as ImagePicker from "expo-image-picker";

//import firebase ..
import { getAuth } from 'firebase/auth';
import "firebase/compat/firestore";
import "firebase/compat/storage";
import firebase from '../../config/Firebase';

export default function PostCreate({ route, navigation }) {

    const user = getAuth().currentUser;

    if (user !== null) {
        var uid = user.uid;
    }

    const [udata, setUdata] = useState([]);

    const eventId = route.params;
    console.log(eventId);

    //image picker
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(null);
    async function askPer() {
        //ImagePicker.requestMediaLibraryPermissionsAsync();
        //ImagePicker.requestCameraPermissionsAsync();
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== "granted") {
            alert("Permissioned is not allowed !!");
        }
    }

    useEffect(() => {

        let userRef = firebase.firestore().collection("users").doc(uid);

        userRef.get().then((snapshot) => {
            setUdata({
                name: snapshot.data().name,
                picture: snapshot.data().picture
            });
        });

        askPer();
        return () => {setUdata([]); setPic([]); setImage([]);};
    }, []);

    const [pic, setPic] = useState("");

    const takePhoto = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        //console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
            let response = await fetch(result.uri);
            let blob = await response.blob();

            var filename = (`PostPhoto/${Date.now()}`).toString(36);

            var storageRef = firebase.storage().ref();
            var imgRef = storageRef.child(filename + ".jpg");

            await imgRef
                .put(blob)
                .then((snap) => {
                    //alert("Uploaded !");
                }).catch((error) => alert(error.message));
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

        //console.log(result.uri);
        var filename = (`PostPhoto/${Date.now()}`).toString(36);
        //console.log(filename);

        if (!result.cancelled) {
            setImage(result.uri);
            let response = await fetch(result.uri);
            let blob = await response.blob();

            var storageRef = firebase.storage().ref();
            var imgRef = storageRef.child(filename + ".jpg");

            await imgRef
                .put(blob)
                .then((snapshot) => {
                    // alert("Uploaded !");
                }).catch((error) => alert(error.message));
            const url = await imgRef.getDownloadURL();
            setPic(url);
        }


    };

    // set value
    const [evDes, setEvDes] = useState("");


    //function insert Event to database
    async function insertToDatabase() {
        try {
            let collRef = firebase.firestore().collection("events").doc(eventId.eid).collection('posts');

            collRef.add({
                picture: pic,
                des: evDes,
                postUid: uid,
                username: udata.name,
                userpicture: udata.picture,
            });

            alert("Success!!");

            navigation.goBack();

        } catch (e) {
            console.log(e);
        }
    }

    return (
        <SafeAreaView style={styles.container}>

            <ImageBackground source={require('../../assets/BG.png')} style={styles.container}>


                <View style={styles.pictureSec}>
                    <View style={{ flexDirection: 'row' }}>
                    <Image source={{ uri: udata.picture }} style={{
            width: 58,
            height: 58,
            borderRadius: 63,
            borderWidth: 2,
            borderColor: "black",
            marginBottom: 0,
            marginTop: 25,
            marginLeft: 40,
          }

          } />
                    <Text style={styles.headerusertext}>{udata.name}</Text>
                    </View>




                <View style={{ backgroundColor: 'white', borderRadius: 10, width: 300, height: 170, marginLeft: 50, marginTop: 20 }}>
          <Text style={styles.textother2}>ยังไม่มีรูป</Text>
          {image && <Image source={{ uri: image }} style={styles.imagepost} />}

        </View>
    
        </View>

        <View style={styles.containericon}>
            <Ionicons name="camera" size={30} color="black"
              style={{ marginRight: 20 ,marginTop:100 }}
              onPress={takePhoto} />
            <MaterialIcons name="photo-library" size={30} color="black"
              style={{marginRight: 40  ,marginTop:100}}
              onPress={pickImage} />
          </View>
          
          <View style={styles.descSec}>
                    <Text  style={[
              styles.textNormal,
              { marginBottom: -450, marginLeft: "5%", marginRight: "5%" },
            ]}>Description</Text>
            </View>
          <View style={styles.boxdescription}>
            <TextInput
              style={[
                styles.descBox,
                { marginLeft: "10%", marginRight: "5%", borderRadius: 5, width: '80%' ,marginTop:120},
              ]}
              multiline={true}
              onChangeText={setEvDes}
              placeholder="พิมพ์อะไรหน่อยสิ..."
            />
          </View>
                   
                <View style={styles.containerbutton}>
                  
                    <TouchableOpacity style={styles.buttoncancle} onPress={() => navigation.goBack()}>
                        <Text style={styles.textother1}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonapply} onPress={() => insertToDatabase()}>
                        <Text style={styles.textother1}>Post</Text>
                    </TouchableOpacity>

                </View>
            </ImageBackground>
        </SafeAreaView>

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
    descSec: {
        height: '30%',
        justifyContent: "center",
        width: 350,
    
        flexDirection: "column",
      },
    avatar: {
        marginLeft: 45,
        marginTop: 35,
    },
    imagepost: {
        width: 300,
        height: 180,
        borderRadius: 5,
        marginTop: -100,
    },
    cardContainer: {
        width: "85%",
        backgroundColor: 'white',
        height: 140,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 5,
            height: 5,
        }
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
    textother2: {
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 115,
        marginTop: 70,
    },
    pictureSec: {
        flex: 4,
        flexDirection: "column",
        width: 400,
        
    },

    boxdescription: {
        width: 400,
    height: 130,
    marginTop: 25,
    borderRadius: 20,
    },

    textInput: {
        color: "grey",
        height: 30,
        borderColor: "black",
        borderWidth: 1,
        paddingLeft: 10,
        backgroundColor: "white",
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
    },
    buttoncancle: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 400,
        marginBottom: 100,
        width: 150,

        borderRadius: 30,
        backgroundColor: "#E30000",
    },
    buttonapply: {
        height: 45,
        marginRight: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 400,
        marginBottom: 100,
        width: 150,
        marginLeft: 5,
        borderRadius: 30,
        backgroundColor: "#30BD68",
    },

    containerbutton: {
        marginTop: -250,
        flexDirection: "row",
    },
    containericon: {
        marginBottom: -332,
        marginLeft: 280,
        flexDirection: "row",
    },
    headerusertext: {
        fontWeight: "bold",
        marginLeft: 20,
        fontSize: 20,
        marginTop: 40,

    },
    textNormal: {
        fontWeight: 'bold',
        color: 'white',
       
      },
});
