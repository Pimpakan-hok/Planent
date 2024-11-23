import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';

import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createDrawerNavigator, DrawerItem, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, ImageBackground, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Image } from 'react-native';

import HomeEventList from './eventHome/HomeEventList';

import MyEvent from './myEvents/MyEventListMain';

import History from './history/HistorySt';

import AccountManagement from './accountManagement/AccountManagement';

import { getAuth } from 'firebase/auth';
import firebase from '../config/Firebase';

const usercall = () => {
    const isFocused = useIsFocused();
    const [userdata, setUserdata] = useState([]);

    useEffect(() => {
        const dataloader = firebase.firestore().collection('users').doc(uid).get().then((snapshot) => {
            setUserdata(snapshot.data());
        })
        return () => dataloader()
    }, [isFocused]);
}

const Drawer = createDrawerNavigator();

const ScreenStacker = ({ navigation }) => {

    const user = getAuth().currentUser;

    if (user !== null) {
        var uid = user.uid;
    }

    async function Logout() {
        await firebase.auth().signOut().then(() => navigation.navigate('LoginScreen'))
            .catch((error) => {
                alert(error.message);
            });
    }

    function CustomDrawerContent(props) {

        const isFocused = useIsFocused();
        const [userdata, setUserdata] = useState([]);

        useEffect(() => {
            const dataloader = firebase.firestore().collection('users').doc(uid).get().then((snapshot) => {
                setUserdata(snapshot.data());
            })
        }, [isFocused]);

        return (
            <View style={{ flex: 1 }}>
                <DrawerContentScrollView {...props}>
                    <Image source={{ uri: userdata.picture }} style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        alignSelf: 'center',
                        margin: 10
                    }} />
                    <Text style={{
                        alignSelf: 'center',
                        fontSize: 20,
                        fontWeight: 'bold',
                        margin: 5
                    }}>
                        {userdata.name}
                    </Text>
                    <DrawerItemList {...props} />
                    <DrawerItem label="Logout" onPress={() => Logout()} />
                </DrawerContentScrollView>
            </View>
        );
    }

    return (
        <NavigationContainer>

            <Drawer.Navigator
                initialRouteName="Home"
                drawerType="front"
                useLegacyImplementation
                drawerContent={(props) =>
                    <CustomDrawerContent {...props} />
                    
                }
                >

                <Drawer.Screen name="Home" component={HomeEventList} />
                <Drawer.Screen name="My Event" component={MyEvent} />
                <Drawer.Screen name="History" component={History} />
                <Drawer.Screen name="Account Management" component={AccountManagement} />

            </Drawer.Navigator>
        </NavigationContainer>
    );

}

export default ScreenStacker;