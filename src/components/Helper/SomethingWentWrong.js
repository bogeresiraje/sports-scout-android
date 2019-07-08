import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import input from '../../res/styles/input';
import layout from '../../res/styles/layout';
import text from '../../res/styles/text';


export default SomethingWentWrong = ({ tryAgain }) => (
    <View style={ layout.justifyMaxGrey }>
        <Text style={ text.autoBlack }>Failed to Connect</Text>
        <TouchableOpacity onPress={ () => { tryAgain() } } >
            <Text style={ text.autoArmyGreen }>Try Again</Text>
        </TouchableOpacity>
    </View>
)