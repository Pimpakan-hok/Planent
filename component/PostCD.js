import * as React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';


export default function Post(props) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: props.userpicture }} style={{
        width: 58,
        height: 58,
        borderRadius: 63,
        borderWidth: 2,
        borderColor: "black",
        marginBottom: 60,
        marginRight: 220,
      }

      } />

      <Text style={{
        fontSize: 16,
        marginRight: 80,
        marginBottom: 20,
        marginTop: -100,
        color: "black",
        fontWeight: 'bold',
      }}>
        {props.username}</Text>
      <Image source={{ uri: props.picture }} style={{
        borderRadius: 15,
        width: '80%',
        height: 130,
        marginRight:25,
        marginTop: 15,
      }
      } />
    </View>
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
    height: 230,
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