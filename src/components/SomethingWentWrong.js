import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import inputStyles from '../res/styles/input';


export default SomethingWentWrong = ({ tryAgain }) => (
    <View style={ inputStyles.autoContent }>
        <Text>Failed to Connect</Text>
        <TouchableOpacity onPress={ () => { tryAgain() } } >
            <Text style={ inputStyles.blueText }>Try Again</Text>
        </TouchableOpacity>
    </View>
)