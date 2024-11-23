import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, TextInput, FlatList, Dimensions, ScrollView, ActivityIndicator, BackHandler } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import ActionButton from 'react-native-circular-action-menu';
import Dialog from "react-native-dialog";
//icon
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import firebase from '../../config/Firebase';

const PostDetailOwner = ({ route, navigation }) => {

    const [visible, setVisible] = useState(false);

    const isFocused = useIsFocused();

    const evpoid = route.params;

    const [data, setData] = useState([]);

    async function deletePost() {
        setVisible(false);
        let docRef = firebase.firestore().collection('events').doc(evpoid.eid).collection('posts').doc(evpoid.poid);
        const res = await docRef.delete().then(() => navigation.goBack())

        return res;
    }

    useEffect(() => {

        let firecaller = firebase.firestore().collection('events').doc(evpoid.eid).collection('posts').doc(evpoid.poid);

        firecaller.get().then((querySnap) => {
            setData({
                des: querySnap.data().des,
                picture: querySnap.data().picture,
                postUid: querySnap.data().postUid,
                username: querySnap.data().username,
                userpicture: querySnap.data().userpicture,
            });
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

    }, [isFocused]);

    // () => navigation.navigate('PostEditor', { eid: evpoid.eid, poid: evpoid.poid })

    return (
        <ImageBackground source={require('../../assets/BG.png')} style={styles.bgcontainer}>
            <View style={styles.container}>

                <View style={styles.cardContainer}>

                    <Image source={{ uri: data.userpicture }} style={{
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
                        {data.username}</Text>
                    <Image source={{ uri: data.picture }} style={{
                        borderRadius: 10,
                        width: '95%',
                        height: 150,
                        marginLeft: 7,
                        marginTop: 4,
                    }
                    } />
                    <Text style={styles.DesStyle}>Description</Text>
                    <Text style={styles.titleStyle}> {data.des} </Text>


                </View>
            </View>
            <View style={{ flex: 1, backgroundColor: '#f3f3f3', marginLeft: '80%' }}>
                <ActionButton buttonColor="rgba(106, 90, 205,1)" position="right">
                    <ActionButton.Item buttonColor='#3498db' title="Delete" onPress={() => setVisible(true)}>
                        <FontAwesome name="trash" size={15} color="white" />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#9b59b6' title="Edit Event" onPress={() => navigation.navigate('PostEditor', { eid: evpoid.eid, poid: evpoid.poid })}>
                        <Ionicons name="pencil" size={20} color="white" />
                    </ActionButton.Item>
                </ActionButton>
            </View>

            <Dialog.Container visible={visible}>
                <Dialog.Title>Delete this post?</Dialog.Title>
                <Dialog.Button label="Cancel" onPress={() => setVisible(false)} />
                <Dialog.Button label="Delete" onPress={() => deletePost()} />
            </Dialog.Container>
        </ImageBackground>
    );
}

const deviceWidth = Math.round(Dimensions.get('window').width);


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
        height: 350,
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
        margin: -5,
        marginLeft: -9.9,
    },
    avatar: {

        marginTop: -10,
    },
    titleStyle: {
        fontSize: 16,
        marginTop: 15,
        marginLeft: 17,
        fontWeight: 'bold',
    },
    DesStyle: {
        fontSize: 18,
        marginTop: 15,
        marginLeft: 20,
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

export default PostDetailOwner;