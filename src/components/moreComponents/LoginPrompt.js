import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import inputStyles from '../../res/styles/input';



export default LoginPrompt = ({ login }) => (
    <View style = { inputStyles.autoContent }>
        <Text>You Are Currently Not Logged In</Text>
        <TouchableOpacity onPress={ () => login() } >
            <Text style={ inputStyles.blueText }>Login</Text>
        </TouchableOpacity>
    </View>
)