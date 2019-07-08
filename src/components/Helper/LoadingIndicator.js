import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import layout from '../../res/styles/layout';



export default LoadingIndicator = () => (
    <View style={ layout.justifyMaxGrey }>
        <ActivityIndicator color='green' />
    </View>
)

const styles = StyleSheet.create({
    container: {
        margin: '50%',
    }
})
