import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import layout from '../../res/styles/layout';
import buttons from '../../res/styles/buttons';
import text from '../../res/styles/text';


export default ({ navigation}) => (
    <View style={ layout.justifyMaxGrey }>
        <TouchableOpacity
            style={ buttons.rectArmyGreenButton }
            onPress={ () => { navigation.navigate('CreateManagerAccount') } }
        >
            <Text  style={ text.autoWhite } >Manager Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={ buttons.rectArmyGreenButton }
            onPress={ () => { navigation.navigate('CreateScoutAccount') } }
        >
            <Text  style={ text.autoWhite } >Scout Account</Text>
        </TouchableOpacity>
    </View>
)
