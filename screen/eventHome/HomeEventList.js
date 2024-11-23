import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    FlatList,
    ScrollView,
    ImageBackground,
    Animated,
    LogBox,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';

import ActionButton from 'react-native-circular-action-menu';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EventRandomizer from './EventRandomizer';
import CreateEvent from './CreateEv';

import OwnerViewEvent from './OwnerViewEvent';
import OwnerEditEvent from './OwnerEditEvent';
import GuestEvJo from '../myEvents/Guest/GuestEvJo';
import GuestEvJoed from '../myEvents/Guest/GuestEvJoed';
import PostDetail from '../Posts/PostDetail';
import PostDetailOwner from '../Posts/PostDetailOwner';
import PostEditor from '../Posts/PostEditor';
import PostCreate from '../Posts/PostCreate';
import PostListMain from '../Posts/PostListMain';

import { getAuth } from 'firebase/auth';
import firebase from '../../config/Firebase';
import { BackgroundImage } from 'react-native-elements/dist/config';
import { RefreshControl } from 'react-native-web';

/*const datalist = [
    { id: '1', name: 'A' },
    { id: '2', name: 'B' },
    { id: '3', name: 'C' },
];*/

const HomeEventMain = ({ navigation }) => {

    const isFocused = useIsFocused();

    const user = getAuth().currentUser;

    if (user !== null) {
        var uid = user.uid;
    }

    // const [searchInput, setSearchInput] = useState([]);

    const [datafire, setDatafire] = useState([]);

    const [myjoindata, setMyjoindata] = useState([]);

    useEffect(() => {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
        LogBox.ignoreLogs(['Internal React error']);
        LogBox.ignoreLogs(["The action 'POP_TO_TOP'"]);

        loader();

        return () => { setMyjoindata([]); setDatafire([]); };

    }, [isFocused]);

    const loader = () => {
        let usereventload = firebase.firestore().collection('users').doc(uid).collection('eventjoin');

        const cuserevjdata = usereventload.get().then((snapshot) => {
            const eventidarr = [];

            snapshot.forEach(documentSnapshot => {
                eventidarr.push(documentSnapshot.data().eventIdreplica);
            });
            setMyjoindata(eventidarr);
        });

        const dataloader = firebase.firestore().collection('events').where('eventState', 'in', ['preparation', 'started']).onSnapshot(querySnap => {
            const datafire = [];

            querySnap.forEach(documentSnap => {
                datafire.push({
                    ...documentSnap.data(),
                    key: documentSnap.id,
                });
            });
            setDatafire(datafire);
        });
    }

    function CheckId(OwnerUid, eventkey) {
        if (uid !== OwnerUid) {
            if (myjoindata.includes(eventkey)) {
                try {
                    navigation.navigate('GuestEventJoined', { eid: eventkey });
                } catch (e) {
                    console.log(e);
                }
            } else {
                try {
                    navigation.navigate('GuestEvent', { eid: eventkey });
                } catch (e) {
                    console.log(e);
                }
            }
        } else {
            try {
                navigation.navigate('OwnerViewEvent', { eid: eventkey });
            } catch (e) {
                console.log(e);
            }
        }
    }

    const renderItem = ({ item }) => ( //ประกาศ component มา render

        <ScrollView>
            <View style={styles.container}>

                <TouchableOpacity onPress={() => CheckId(item.eventUid, item.key)} style={styles.cardContainer}>

                    <Image source={{ uri: item.eventPicture }} style={{
                        borderTopRightRadius: 10,
                        borderTopLeftRadius: 10,

                        width: '100%',
                        height: 100
                    }} />
                    
                    <Text style={styles.titleStyle}>Event: {item.eventName} </Text>
                    <Text style={styles.categoryStyle}>Description: {item.eventDes}</Text>
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
                data={datafire} //array data
                renderItem={renderItem}
            //
            //ดึงข้อมูล data มา render และจะ render ในรูปแบบของตัว swipe จาก itembox.js
            //โชว์ผลลัพธ์ ที่ import จาก itembox.js
            />


            {/* Circular Action Button ปุ่มกลมๆ */}
            <View style={{ marginBottom: "5%", backgroundColor: '#f3f3f3', marginLeft: '80%' }}>
                <ActionButton buttonColor="rgba(106, 90, 205, 1)" position="right">
                    <ActionButton.Item buttonColor='#9b59b6' title="Random" onPress={() => navigation.navigate("EventRandomizer")}>
                        <FontAwesome name="random" size={20} color="white" />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#9b59b6' title="Create Event" onPress={() => navigation.navigate("CreateEvent")}>
                        <Ionicons name="add" size={25} color="white" />
                    </ActionButton.Item>
                </ActionButton>
            </View>
        </ImageBackground>
    );

}

const Stack = createNativeStackNavigator();

function HomeEventList() {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName="HomeMain">
                <Stack.Screen name="HomeMain" component={HomeEventMain} options={{ headerShown: false }} />
                <Stack.Screen name="CreateEvent" component={CreateEvent} options={{ headerShown: false }} />
                <Stack.Screen name="EventRandomizer" component={EventRandomizer} options={{ headerShown: false }} />
                <Stack.Screen name="OwnerViewEvent" component={OwnerViewEvent} options={{ headerShown: false }} />
                <Stack.Screen name="OwnerEditEvent" component={OwnerEditEvent} options={{ headerShown: false }} />
                <Stack.Screen name="GuestEvent" component={GuestEvJo} options={{ headerShown: false }} />
                <Stack.Screen name="GuestEventJoined" component={GuestEvJoed} options={{ headerShown: false }} />
                <Stack.Screen name="PostList" component={PostListMain} options={{ headerShown: false }} />
                <Stack.Screen name="PostDetail" component={PostDetail} options={{ headerShown: false }} />
                <Stack.Screen name="PostDetailOwner" component={PostDetailOwner} options={{ headerShown: false }} />
                <Stack.Screen name="PostEditor" component={PostEditor} options={{ headerShown: false }} />
                <Stack.Screen name="PostCreate" component={PostCreate} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const deviceWidth = Math.round(Dimensions.get('window').width);


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
    cardContainerText: {
        width: "85%",
        backgroundColor: 'white',
        height: 25,
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
    container: {
        width: 330,
        alignItems: 'center',
        marginTop: 25,
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
    PrivateStyle: {
        fontSize: 16,
        marginLeft: 10,
        marginTop: -55,
        color: '#CF0000',
        fontWeight: 'bold',
        marginLeft: 220,
    },
    categoryStyle: {
        fontWeight: '100',
        marginTop: 10,
        marginLeft: 10,
    },
    infoStyle: {
        marginTop: 20,
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    input: {
        height: 45,
        width: '90%',
        borderWidth: 1,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 5,
        paddingLeft: 10,
    }
});

export default HomeEventList;