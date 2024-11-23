import React, { useEffect, useState } from "react";
import { View, Text, ImageBackground, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Image, LogBox } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { getAuth } from 'firebase/auth';
import firebase from '../../config/Firebase';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import GuestEvJoed from "../myEvents/Guest/GuestEvJoed";
import PostCreate from "../Posts/PostCreate";
import PostEditor from "../Posts/PostEditor";
import PostDetail from "../Posts/PostDetail";
import PostDetailOwner from "../Posts/PostDetailOwner";
import PostListMain from "../Posts/PostListMain";

const HistoryMain = ({ navigation }) => {

    const isFocused = useIsFocused();

    const user = getAuth().currentUser;

    if (user !== null) {
        var uid = user.uid;
    }

    const [dataquery, setDataQuery] = useState([]);

    useEffect(() => {
        LogBox.ignoreLogs(["The action 'POP_TO_TOP'"]);

        const firecall = firebase.firestore().collection('users').doc(uid).collection('eventjoin').onSnapshot((querySnap) => {

            const evidquery = [];

            querySnap.forEach((documentque) => {
                evidquery.push({
                    ...documentque.data(),
                    key: documentque.data().eventIdreplica,
                });
            });
            setDataQuery(evidquery);
        });

        return () => firecall();

    }, [isFocused]);

    const renderItem = ({ item }) => ( //ประกาศ component มา render

        <ScrollView>
            <View style={styles.container}>

                {/* create function check id (parameter =  item.key) /check uid,item key /return true/false */}
                <TouchableOpacity onPress={() => navigation.navigate('GuestEvJoed', { eid: item.eventIdreplica })} style={styles.cardContainer}>
                    <Image source={{ uri: item.eventPicture }} style={{
                        borderTopRightRadius: 10,
                        borderTopLeftRadius: 10,

                        width: '100%',
                        height: 100
                    }} />

                    <Text style={styles.titleStyle}>Events: {item.eventName} </Text>
                    <Text style={styles.categoryStyle}>Descriptions: {item.eventDes}</Text>
                    <Image source={{ uri: item.eventPrivateText }} style={{
                       width:30 , marginLeft:"85%" , height:30 , marginTop:-40
                    }}/>

                </TouchableOpacity>

            </View>
        </ScrollView>

        //view จาก Itembox และ เรียก data มา มีตัวเเปรเป็น item
    );

    return (
        <ImageBackground source={require('../../assets/BG.png')} style={styles.bgcontainer}>
            <FlatList
                data={dataquery} //array data
                renderItem={renderItem}
            // 
            //ดึงข้อมูล data มา render และจะ render ในรูปแบบของตัว swipe จาก itembox.js
            //โชว์ผลลัพธ์ ที่ import จาก itembox.js
            />
        </ImageBackground>
    );
}

const Stack = createNativeStackNavigator();

function History() {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName="HistoryMain">
                <Stack.Screen name="HistoryMain" component={HistoryMain} options={{ headerShown: false }} />
                <Stack.Screen name="GuestEvJoed" component={GuestEvJoed} options={{ headerShown: false }} />
                <Stack.Screen name="PostList" component={PostListMain} options={{ headerShown: false }} />
                <Stack.Screen name="PostDetail" component={PostDetail} options={{ headerShown: false }} />
                <Stack.Screen name="PostDetailOwner" component={PostDetailOwner} options={{ headerShown: false }} />
                <Stack.Screen name="PostEditor" component={PostEditor} options={{ headerShown: false }} />
                <Stack.Screen name="PostCreate" component={PostCreate} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    ACbutton: {

    },
    bgcontainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: null,
        height: null,
    },
    container: {
        width: 330,
        alignItems: 'center',
        marginTop: 25,
    },
    PrivateStyle: {
        fontSize: 16,
        marginLeft: 10,
        marginTop: -55,
        color: '#CF0000',
        fontWeight: 'bold',
        marginLeft: 220,
    },
    cardContainer: {
        width: "85%",
        backgroundColor: 'white',
        height: 180,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 9,
        margin: 5,
        marginLeft: 5,
    },

    titleStyle: {
        fontSize: 16,
        marginLeft: 10,
        marginTop: 10,
        fontWeight: 'bold',
    },
    categoryStyle: {
        fontWeight: '100',
        marginTop: 10,
        marginLeft: 10,
    },
    infoStyle: {
        marginHorizontal: 10,
        marginVertical: 5,
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
});

export default History;