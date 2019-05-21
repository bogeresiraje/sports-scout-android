import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import LoadingIndicator from '../LoadingIndicator';
import { createAccount, send } from '../../data/fetch';
import inputStyles from '../../res/styles/input';
import createStyles from '../../res/styles/createAccount';
import SomethingWentWrong from '../SomethingWentWrong';

 export default class extends Component {
     constructor(props) {
         super(props);
         this.state = {
             loading: false,
             username: "",
             email: "",
             name: "",
             password: "",
             submitState: false,
             nullInputError: false,
             passwordError: false,
             confirmPassword: "",
             confirmPasswordState: 0,
             creatingAccountIndicator: false,
             somethingWrong: false,
         }
     }

     componentWillMount() {
         this.setState({ loading: true });
     }

     componentDidMount() {
         this.setState({ loading: false })
     }

     handleSubmit = () => {
        this.setState({ submitState: true });
        if(this.state.username && this.state.email && this.matchPasswords()) {
            this.createAccount();
        }
     }

     matchPasswords = () => {
         const { password, confirmPassword } = this.state;
         if(password && confirmPassword) {
             if (password === confirmPassword) {
                 return true;
             }else {
                 return false;      
             }
         } else {
             return false;
         }
     };

     createAccount = () => {
        this.setState({creatingAccountIndicator: true});

        const { email, username, password } = this.state;
        const formData = new FormData();
        formData.append('email', email);
        formData.append('username', username);
        formData.append('password', password);

        send('/create_account', formData)
            .then(
                response => {
                    const validity = response.validity;
                    if(validity === 'INVALID_EMAIL'){
                        alert(validity)
                    }else if(validity === 'INVALID_USERNAME'){
                        alert(validity)
                    }else if(validity === 'ERROR'){
                        this.setState({somethingWrong: true });
                    }else {
                        this.props.navigation.navigate("ConfirmAccount");
                    }
                }
            )

     }

     _tryAgain = () => {}

     render() {
         if(this.state.somethingWrong){
             return (
                 <SomethingWentWrong tryAgain={ this._tryAgain } />
             );
         } else {
            return (
                <ScrollView style={ inputStyles.container } >
                   {
                       this.state.loading ?
                           <LoadingIndicator /> :
                           <View>
                               <Text style={ inputStyles.inputLabel } >username</Text>
                                   {
                                       !this.state.submitState ?
                                           null:
                                           this.state.username ?
                                               null :
                                               <Text style={ inputStyles.redLabel } >this field is required</Text>
                                   }
                               <TextInput
                                   style={ inputStyles.inputText }
                                   value={ this.state.username }
                                   returnKeyType='next'
                                   onChangeText={ text => this.setState({ username: text }) } 
                                   enablesReturnKeyAutomatically={ true }
                               />
   
                               <Text style={ inputStyles.inputLabel } >email</Text>
                               {
                                   !this.state.submitState ?
                                       null:
                                       this.state.email ?
                                           null :
                                           <Text style={ inputStyles.redLabel } >this field is required</Text>
                               }
                               <TextInput 
                                   style={ inputStyles.inputText }
                                   value={ this.state.email }
                                   returnKeyType='next'
                                   onChangeText={ text => this.setState({ email: text }) } 
                               />
   
                               <Text style={ inputStyles.inputLabel } >password</Text>
                               {
                                   !this.state.submitState ?
                                       null:
                                       this.state.password ?
                                           null :
                                           <Text style={ inputStyles.redLabel } >this field is required</Text>
                               }
                               <TextInput 
                                   style={ inputStyles.inputText }
                                   secureTextEntry={ true }
                                   autoCorrect={ false }
                                   returnKeyType='next'
                                   value={ this.state.password }
                                   onChangeText={ text => this.setState({ password: text }) }
                                   enablesReturnKeyAutomatically={ true } 
                               />
   
                               <Text style={ inputStyles.inputLabel } >confirm password</Text>
                               {
                                   !this.state.submitState ?
                                       null:
                                       this.state.confirmPassword ?
                                           null :
                                           <Text style={ inputStyles.redLabel } >this field is required</Text>
                               }
                               {
                                   this.state.password && this.state.confirmPassword?
                                   this.matchPasswords() ?
                                       <Text style={ inputStyles.greenLabel } >passwords match</Text> :
                                       <Text style={ inputStyles.redLabel } >passwords do not match</Text> :
                                   null
                               }
                    
                               <TextInput 
                                   style={ inputStyles.inputText }
                                   secureTextEntry={ true }
                                   autoCorrect={ false }
                                   returnKeyType='go'
                                   value={ this.state.confirmPassword }
                                   onChangeText={ text => {
                                       this.setState({confirmPassword: text, confirmPasswordState: 1});
                                   }
                                   }
                                />
   
                               {
                                   this.state.creatingAccountIndicator ?
                                       <View style={ createStyles.loader } >
                                           <View style={ createStyles.creatingTextContainer } >
                                               <Text style={ createStyles.creatingText } >creating</Text>
                                           </View>
                                           <View>
                                               <ActivityIndicator
                                                   color='#fff'
                                                   style={ createStyles.indicator }
                                               />
                                           </View>
                                       </View> :
   
                                       <TouchableOpacity
                                           style={ inputStyles.inputSendButton }
                                           onPress={ () => { this.handleSubmit() } }
                                       >
                                           <Text  style={ inputStyles.inputSendText } >Create Account</Text>
                                       </TouchableOpacity>
                               }
   
                           </View>
                   }
                </ScrollView>
            )
         }
     }
 }
