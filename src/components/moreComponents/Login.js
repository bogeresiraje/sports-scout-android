import React, { Component } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import LoadingIndicator from '../LoadingIndicator';
import SomethingWentWrong from '../SomethingWentWrong';
import inputStyles from '../../res/styles/input';
import { send } from '../../data/fetch';
import layout from '../../res/styles/layout';
import input from '../../res/styles/input';
import text from '../../res/styles/text';
import buttons from '../../res/styles/buttons';


 export default class Login extends Component {
     constructor(props) {
         super(props);
         this.state = {
             loading: false,
             somethingWrong: false,
             username: "",
             password: "",

             submitState: false,
             scoutActiveIndicator: false,
             managerActiveIndicator: false,
             wrongCredentials: false,
         };
     }

    componentWillMount() {
        this.setState({ loading: true });
    }

     componentDidMount() {
         this.setState({ loading: false });
     }

     _loginManager = () => {
         this.setState({ loggingIndicator: true, submitState: true });
         if(this.state.username && this.state.password) {
            const formData = new FormData();
            formData.append('username', this.state.username);
            formData.append('password', this.state.password);

            send('/login_manager', formData)
            .then(
                response => {
                    if(response.username) {
                        this._saveCredentials(response.username);
                        this.setState({ wrongCredentials: true, submitState: false, loggingIndicator: false });
                        this.props.navigation.navigate('More');
                    } else {
                        this.setState({somethingWrong: true, submitState: false, loggingIndicator: false})
                    }
                },
                () => {
                    this.setState({ somethingWrong: true, submitState: false, loggingIndicator: false });
                }
            )
            .catch(() => { 
                this.setState({ somethingWrong: true, submitState: false, loggingIndicator: false }) })

         } else {
             this.setState({ loggingIndicator: false })
         }
     }

     _loginScout = () => {}

     tryAgain = () => {
         this.setState({ loggingIndicator: false, submitState: false, somethingWrong: false})
     }

     _saveCredentials = async (username) => {
        try {
            await AsyncStorage.setItem('user', JSON.stringify(username));
        } catch(err){
            this.setState({ loggingIndicator: false, submitState: false, somethingWrong: true });
        }
     }

     render() {
         const { loading, somethingWrong, submitState, username, password, wrongCredentials,
                scoutActiveIndicator, managerActiveIndicator
            } = this.state;

         if(loading) {
             return (
                 <LoadingIndicator />
             );
         } else if(somethingWrong) {
            return (
                <SomethingWentWrong tryAgain = { this.tryAgain } />
            );
         } else {
            return (
                <ScrollView style={ layout.container } >
                    <Text style={ input.label } >username or email</Text>
                    {
                       !submitState ?
                           null:
                           username ?
                               null :
                               <Text style={ text.autoRed } >this field is required</Text>
                    }
                    {
                        wrongCredentials ?
                            <Text style={ text.autoRed } >wrong username or password</Text>:
                            null
                    }
                    <TextInput
                        style={ input.inputText }
                        autoCapitalize = 'none'
                        value = { username }
                        onChangeText = { text => this.setState({ wrongCredentials: false, submitState: false,
                            username: text })}
                    />
   
                    <Text style={ input.label } >password</Text>
                    {
                       !submitState ?
                           null:
                           password ?
                               null :
                               <Text style={ text.autoRed } >this field is required</Text>
                    }
                    <TextInput
                        style={ input.inputText }
                        secureTextEntry = { true }
                        value = { password }
                        onChangeText = { text => this.setState({ wrongCredentials: false, submitState: false,
                            password: text })}
                    />
   
                    <TouchableOpacity
                        style={ buttons.rectArmyGreenButton }
                        onPress={ () => { this._loginScout() } }
                    >
                        <Text  style={ text.autoWhite } >Log In As Scout</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={ buttons.rectArmyGreenButton }
                        onPress={ () => { this._loginManager() } }
                    >
                        <Text  style={ text.autoWhite } >Log In As Manager</Text>
                    </TouchableOpacity>

                   <View style={ inputStyles.centeredContent }>
                        <Text>Forgot Password?</Text>
                        <TouchableOpacity
                            onPress={ f => f }
                        >
                            <Text  style={ inputStyles.blueText } >reset</Text>
                        </TouchableOpacity>
                   </View>

                </ScrollView>
            );
         }
     }
 }