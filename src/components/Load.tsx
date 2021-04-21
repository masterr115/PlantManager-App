import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native'
import LottieView from 'lottie-react-native'

import loadAnimantion from '../assets/load.json'

export function Load() {
  return (
    <View style={styles.container}>
      <LottieView 
        source={loadAnimantion} 
        autoPlay 
        loop 
        style={styles.animantion}
      />
    </View>
  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  animantion: {
    backgroundColor: 'transparent',
    width: 200,
    height: 200
  }

})