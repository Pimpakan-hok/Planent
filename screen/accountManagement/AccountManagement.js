import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, ActivityIndicator, LogBox } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { getAuth } from 'firebase/auth';
import firebase from '../../config/Firebase';

import ChangeProfile from './AccMEdit';
import ChangeEmail from './AccMNewE';
import ChangePW from './AccMNewPass';

function AccMMpage({ navigation }) {
    const isFocused = useIsFocused();

    const user = getAuth().currentUser;
    const [name, setName] = useState('');
    const [userInfo, setUserInfo] = useState({ infoName: '', infoPic: null })

    if (user !== null) {
        var email = user.email;
        var uid = user.uid;
    }

    useEffect(() => {
                
        LogBox.ignoreLogs(["The action 'POP_TO_TOP'"]);
        const firecall = firebase.firestore().collection('users').doc(uid).get().then((snapshot) => {
            //setName(snapshot.data().name);
            setUserInfo({ infoName: snapshot.data().name, infoPic: snapshot.data().picture });                    
        });

    }, [isFocused]);

  
    return (
        <ImageBackground source={require('../../assets/BG.png')} style={styles.container}>
            <View style={styles.fullcontain}>
                <View>
                    <Image style={styles.avatar} source={{ uri: userInfo.infoPic }} />
                </View>
                <View style={styles.boxdescription}>
                    <Text style={styles.headerusertext}>Username</Text>
                    <Text style={styles.name}>{userInfo.infoName}</Text>
                    <Text style={styles.headerusertext}>E-mail</Text>
                    <Text style={styles.email}>{email}</Text>
                </View>
                <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('ChangeProfile')}>
                    <Text style={styles.textother}>Edit</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const Stack = createNativeStackNavigator();

function AccountManagement() {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName="AccMMain">
                <Stack.Screen name="AccMMain" component={AccMMpage} options={{ headerShown: false }} />
                <Stack.Screen name="ChangeProfile" component={ChangeProfile} options={{ headerShown: false }} />
                <Stack.Screen name="ChangeEmail" component={ChangeEmail} options={{ headerShown: false }} />
                <Stack.Screen name="ChangePassword" component={ChangePW} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    fullcontain: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: -150
    },
    email: {
        fontSize: 14,
        marginTop: 5,
        marginLeft: 10,
    },
    name: {
        fontSize: 14,
        marginTop: 5,
        marginLeft: 10,
    },
    textother: {
        fontSize: 16,
        fontWeight: "bold",
    },
    headerusertext: {
        fontWeight: "bold",
        marginLeft: 10,
        fontSize: 16,
        marginTop: 15,

    },
    buttonContainer: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        width: 250,
        borderRadius: 30,
        backgroundColor: "white",
    },
    boxdescription: {
        width: 250,
        height: 140,
        borderRadius: 5,
        backgroundColor: "white",
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: null,
        height: null,
    }
});

export default AccountManagement;