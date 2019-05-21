import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';


export default LoadingIndicator = () => (
    <View style={ styles.container }>
        <ActivityIndicator color='#6370ee' />
    </View>
)

const styles = StyleSheet.create({
    container: {
        margin: '50%',
    }
})
