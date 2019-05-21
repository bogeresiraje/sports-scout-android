import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import inputStyles from '../../res/styles/input';
import layout from '../../res/styles/layout';


export default ({ navigation}) => (
    <View style={ layout.centerDoc }>
        <TouchableOpacity
            style={ inputStyles.inputSendButton }
            onPress={ () => { navigation.navigate('CreateManagerAccount') } }
        >
            <Text  style={ inputStyles.inputSendText } >Manager Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={ inputStyles.inputSendButton }
            onPress={ () => { navigation.navigate('CreateScoutAccount') } }
        >
            <Text  style={ inputStyles.inputSendText } >Scout Account</Text>
        </TouchableOpacity>
    </View>
)
