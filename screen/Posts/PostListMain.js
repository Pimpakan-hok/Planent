import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, TextInput, FlatList, Dimensions, ScrollView, ActivityIndicator, BackHandler } from 'react-native';
import { Card } from 'react-native-paper';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import ActionButton from 'react-native-circular-action-menu';
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import firebase from '../../config/Firebase';

import Post from '../../component/PostCD';

const PostListMain = ({ route, navigation }) => {

    const isFocused = useIsFocused();

    const user = getAuth().currentUser;

    if (user !== null) {
        var uid = user.uid;
    }

    const eventId = route.params;

    const eventIdArray = Object.values(eventId); //event id to array
    const eid = eventIdArray.toString(); //eventarray to string

    const [data, setData] = useState([]);

    useEffect(() => {
        let firecollect = firebase.firestore().collection('events').doc(eventId.eid).collection('posts');

        firecollect.onSnapshot((querySnapshot) => {
            const dataobj = [];

            querySnapshot.forEach((documentSnapshot) => {
                dataobj.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id,
                });
            });
            setData(dataobj);
        });

        const backAction = () => {
            navigation.goBack();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove(), () => { setData([]); };
    }, [isFocused])

    function CheckOwner(uid, ownerid, poid) {
        if (uid !== ownerid) {
            navigation.navigate('PostDetail', { poid: poid, eid: eventId.eid });
        } else {
            navigation.navigate('PostDetailOwner', { poid: poid, eid: eventId.eid });
        }
    }

    const renderItem = ({ item }) => ( //ประกาศ component มา render

        <ScrollView>
            <TouchableOpacity onPress={() => CheckOwner(uid, item.postUid, item.key)} style={styles.cardContainer} key={item.key}>
                <Post
                    key={item.key}
                    picture={item.picture}
                    des={item.des}
                    postUid={item.postUid}
                    username={item.username}
                    userpicture={item.userpicture}
                />
            </TouchableOpacity>
            {/* <View style={styles.container}>
                <TouchableOpacity onPress={() => CheckOwner(uid, item.postUid, item.key)} style={styles.cardContainer} key={item.key}>
                    <Image source={{ uri: item.userpicture }} style={{
                        width: 58,
                        height: 58,
                        borderRadius: 63,
                        borderWidth: 2,
                        borderColor: "black",
                        marginBottom: 10,
                        marginTop: 10,
                        marginLeft: 10,
                    }

                    } />

                    <Text style={{
                        fontSize: 16,
                        marginLeft: 80,
                        marginBottom: 20,
                        marginTop: -50,
                        color: "black",
                        fontWeight: 'bold',
                    }}>
                        {item.username}</Text>
                    <Image source={{ uri: item.picture }} style={{
                        borderRadius: 10,
                        width: '95%',
                        height: 150,
                        marginLeft: 7,
                        marginTop: 4,
                    }
                    } />

                </TouchableOpacity>
            </View> */}
        </ScrollView>

        //view จาก Itembox และ เรียก data มา มีตัวเเปรเป็น item
    );

    return (
        <ImageBackground source={require('../../assets/BG.png')} style={styles.bgcontainer}>
            <FlatList
                data={data} //array data
                renderItem={renderItem}
                //ดึงข้อมูล data มา render และจะ render ในรูปแบบของตัว swipe จาก itembox.js
                //โชว์ผลลัพธ์ ที่ import จาก itembox.js
                keyExtractor={item => item.key} />

            <View style={{ marginBottom: "5%", backgroundColor: '#f3f3f3', marginLeft: '80%' }}>
                <ActionButton buttonColor="rgba(106, 90, 205,1)" position="right" onPress={() => navigation.navigate('PostCreate', { eid })} />
            </View>
        </ImageBackground>
    );

}

const styles = StyleSheet.create({
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
    cardContainer: {
        width: "85%",
        backgroundColor: 'white',
        height: 250,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 9,
        margin: 20,
        marginLeft: 25,
    },
    cardContainerimage: {
        width: 281,
        backgroundColor: 'white',
        height: 140,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        margin: 5,
        marginLeft: -9.9,
    },
    avatar: {

        marginTop: -10,
    },
    titleStyle: {
        fontSize: 16,
        marginLeft: 35,
        marginTop: 10,
        fontWeight: 'bold',

    },
    categoryStyle: {
        fontWeight: '200',
    },
    infoStyle: {
        marginHorizontal: 10,
        marginVertical: 5,
    },

});

export default PostListMain;