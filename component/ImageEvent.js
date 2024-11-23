import * as React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';

export default function ImageEvent(props) {
  return (

    <Image
      source={{ uri: props.img }}
      style={{ borderRadius: 10, width: 300, height: 200 }}
    />

  );
}