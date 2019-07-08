import React, { Component } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import LoadingIndicator from '../Helper/LoadingIndicator';
import SomethingWentWrong from '../Helper/SomethingWentWrong';
import input from '../../res/styles/input';
import { send } from '../../data/fetch';
import layout from '../../res/styles/layout';
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

     _loginScout = () => {
        this.setState({ loggingIndicator: true, submitState: true });
        if(this.state.username && this.state.password) {
           const formData = new FormData();
           formData.append('email', this.state.username);
           formData.append('password', this.state.password);

           send('/login_scout', formData)
           .then(
               response => {
                   
                   if(response.user_id) {                       
                       this._saveCredentials(response.user_id, 'scout');                       
                       
                   } else {
                       this.setState({wrongCredentials: true, submitState: false, loggingIndicator: false})
                   }
               },
               () => {
                   this.setState({ somethingWrong: true, submitState: false, loggingIndicator: false });
               }
           )
           
        } else {
            this.setState({ loggingIndicator: false })
        }
     };

     _loginManager = () => {
         this.setState({ loggingIndicator: true, submitState: true });
         if(this.state.username && this.state.password) {
            const formData = new FormData();
            formData.append('email', this.state.username);
            formData.append('password', this.state.password);

            send('/login_manager', formData)
            .then(
                response => {
                    
                    if(response.user_id) {                       
                        this._saveCredentials(response.user_id, 'manager');                     
                        
                    } else {
                        this.setState({wrongCredentials: true, submitState: false, loggingIndicator: false})
                    }
                },
                () => {
                    this.setState({ somethingWrong: true, submitState: false, loggingIndicator: false });
                }
            )
            
         } else {
             this.setState({ loggingIndicator: false })
         }
     }

     tryAgain = () => {
         this.setState({ loggingIndicator: false, submitState: false, somethingWrong: false})
     }

     _saveCredentials = async (user_id, status) => {
            try {
                await AsyncStorage.setItem('app_user', user_id.toString());
                await AsyncStorage.setItem('status', status);
                this.props.navigation.navigate('Main');
            }catch(err){
                //
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
                    <Text style={ input.label } >email</Text>
                    {
                       !submitState ?
                           null:
                           username ?
                               null :
                               <Text style={ text.autoRed } >this field is required</Text>
                    }
                    {
                        wrongCredentials ?
                            <Text style={ text.autoRed } >wrong email or password</Text>:
                            null
                    }
                    <TextInput
                        style={ input.inputText }
                        autoCapitalize = 'none'
                        value = { username }
                        keyboardType='email-address'
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

                   <Text style={ text.autoBlack }>OR</Text>

                   <TouchableOpacity
                        style={ buttons.autoBlueButton }
                        onPress={ () => this.props.navigation.navigate('ChooseAccount') }
                    >
                        <Text style={ text.autoWhite }>Create Account</Text>
                    </TouchableOpacity>

                </ScrollView>
            );
         }
     }
 }
