import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, ActivityIndicator,
Picker } from 'react-native';
import PropTypes from 'prop-types';

import LoadingIndicator from '../Helper/LoadingIndicator';
import SomethingWentWrong from '../Helper/SomethingWentWrong';
import { send } from '../../data/fetch';
import input from '../../res/styles/input';
import layout from '../../res/styles/layout';
import text from '../../res/styles/text';
import buttons from '../../res/styles/buttons';
import { get } from '../../data/fetch';

 export default class ManagerAccount extends Component {
     constructor(props) {
         super(props);
         this.state = {
             loading: false,
             somethingWrong: false,

             clubs: [],
             club: {},
             firstName: "",
             lastName: "",
             email: "",
             name: "",
             password: "",
             confirmPassword: "",

             invalidEmail: false,
             invalidUsername: false,

             // controllers
             submitState: false,
             activityIndicator: false,
             somethingWrong: false,
         }
     }

     componentWillMount() {
         this.setState({ loading: true });
     }

     componentDidMount() {
         this._fetchClubs();
     }

     _fetchClubs = async () => {
         get('/get_clubs_without_managers')
            .then(
                response => {
                    if(response.clubs){
                        this.setState({ somethingWrong: false, loading: false, clubs: response.clubs,
                        club: response.clubs[0]})
                    }else {
                        this.setState({ somethingWrong: true, loading: false })
                    }
                },
                () => this.setState({ somethingWrong: true, loading: false })
            )
            .catch(() => this.setState({ somethingWrong: true, loading: false }))
     }

     _handleSubmit = () => {
        this.setState({ submitState: true, activityIndicator: false, somethingWrong: false });
        if(this.state.firstName && this.state.lastName && this.state.email && this._matchPasswords()) {
            this._createAccount();
        }else{
            this.setState({ submitState: true, activityIndicator: false, somethingWrong: false});
        }
     }

     _matchPasswords = () => {
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

     _createAccount = () => {
        this.setState({activityIndicator: true, somethingWrong: false, submitState: true });

        const { email, firstName, lastName, password, club } = this.state;
        const formData = new FormData();
        formData.append('email', email);
        formData.append('first_name', firstName);
        formData.append('last_name', lastName);
        formData.append('club_id', club.id)
        formData.append('password', password);

        send('/create_manager_account', formData)
            .then(
                response => {
                    if(response.success){
                        this.setState({ activityIndicator: false, submitState: false,
                            somethingWrong: false })
                        this.props.navigation.navigate("ConfirmManager");
                    } else {
                        const validity = response.validity;
                        if(validity === 'INVALID_EMAIL'){
                            this.setState({ activityIndicator: false, submitState: false,
                            invalidEmail: true, invalidUsername: false, somethingWrong: false })
                    }else if(validity === 'INVALID_USERNAME'){
                        this.setState({ activityIndicator: false, submitState: false,
                            invalidEmail: false, invalidUsername: true, somethingWrong: false })
                    }else {
                        this.setState({ activityIndicator: false, submitState: false,
                            invalidEmail: false, invalidUsername: false, somethingWrong: true })
                    }
                    }
                },
                () => this.setState({ activityIndicator: false, submitState: false,
                    invalidEmail: false, invalidUsername: false, somethingWrong: true })
            )
            .catch(() => this.setState({ activityIndicator: false, submitState: false,
                invalidEmail: false, invalidUsername: false, somethingWrong: true }))

     }

     _handleClub = club => {
         this.setState({ club: club })
     }

     _tryAgain = () => { 
         this.setState({ loading: true, somethingWrong: false });
         this._createAccount();
     }

     render() {
         const { activityIndicator, somethingWrong, loading, submitState, email,
        password, confirmPassword, invalidEmail, invalidUsername, firstName, lastName,
        clubs, club } = this.state;

         if(somethingWrong){
             return (
                 <SomethingWentWrong tryAgain={ this._tryAgain } />
             );
         } else {
            return (
                <ScrollView style={ layout.paddlessContainer } >
                   {
                        loading ?
                           <LoadingIndicator /> :

                           <View style={ layout.justifyMaxGrey }>

                               <Text style={ text.centerHeadingArmyGreen}>
                                    MANAGER ACCOUNT
                               </Text>

                               <Text style={ input.label } >First Name</Text>
                                   {
                                       !submitState ?
                                           null:
                                           firstName ?
                                               null :
                                               <Text style={ text.autoRed } >this field is required</Text>
                                   }
                                   {
                                       invalidUsername? <Text style={ text.autoRed}>
                                           invalid username
                                       </Text>: null
                                   }
                               <TextInput
                                   style={ input.inputText }
                                   value={ firstName }
                                   returnKeyType='next'
                                   onChangeText={ text => this.setState({ firstName: text,
                                    invalidUsername: false, somethingWrong: false, submitState: false}) } 
                                   enablesReturnKeyAutomatically={ true }
                               />

                               <Text style={ input.label } >Last Name</Text>
                                   {
                                       !submitState ?
                                           null:
                                           lastName ?
                                               null :
                                               <Text style={ text.autoRed } >this field is required</Text>
                                   }
                                   {
                                       invalidUsername? <Text style={ text.autoRed}>
                                           invalid username
                                       </Text>: null
                                   }
                               <TextInput
                                   style={ input.inputText }
                                   value={ lastName }
                                   returnKeyType='next'
                                   onChangeText={ text => this.setState({ lastName: text,
                                    invalidUsername: false, somethingWrong: false, submitState: false}) } 
                                   enablesReturnKeyAutomatically={ true }
                               />

                               <View>
                                   <Text style={ input.label }>Choose Club</Text>
                                   <Picker
                                        selectedValue={ club }
                                        style={ input.picker }
                                        onValueChange={ (club, index) => {
                                            this._handleClub(club)
                                        }}
                                    >
                                        {
                                            clubs.map((club, i) => (
                                                <Picker.Item
                                                    key={ i }
                                                    value={ club }
                                                    label={ club.name }
                                                    />
                                            ))
                                        }   
                                    </Picker>
                               </View>
   
                               <Text style={ input.label } >email</Text>
                               {
                                   !submitState ?
                                       null:
                                       email ?
                                           null :
                                           <Text style={ text.autoRed } >this field is required</Text>
                               }
                               {
                                    invalidEmail? <Text style={ text.autoRed}>
                                        invalid email
                                    </Text>: null
                                }
                               <TextInput 
                                   style={ input.inputText }
                                   value={ this.state.email }
                                   returnKeyType='next'
                                   keyboardType='email-address'
                                   autoCapitalize='none'
                                   onChangeText={ text => this.setState({ email: text, 
                                    submitState: false, invalidEmail: false, somethingWrong: false }) } 
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
                                   secureTextEntry={ true }
                                   autoCorrect={ false }
                                   returnKeyType='next'
                                   value={ password }
                                   onChangeText={ text => this.setState({ password: text }) }
                                   enablesReturnKeyAutomatically={ true } 
                               />
   
                               <Text style={ input.label } >confirm password</Text>
                               {
                                   !submitState ?
                                       null:
                                       confirmPassword ?
                                           null :
                                           <Text style={ text.autoRed } >this field is required</Text>
                               }
                               {
                                   password && confirmPassword?
                                   this._matchPasswords() ?
                                       <Text style={ text.autoGreen } >passwords match</Text> :
                                       <Text style={ text.autoRed } >passwords do not match</Text> :
                                   null
                               }
                    
                               <TextInput 
                                   style={ input.inputText }
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
                                   !(submitState && activityIndicator) ?
                                   <TouchableOpacity
                                        style={ buttons.rectArmyGreenButton} 
                                        onPress = { () => this._handleSubmit() }
                                    >
                                        <Text style={ text.autoWhite }>Submit</Text>
                                    </TouchableOpacity> :

                                    <View style={ buttons.rectArmyGreenButton }>
                                        <View style={ layout.column50ArmyGreen}>
                                            <ActivityIndicator
                                                color='white'
                                            />
                                        </View>
                                    </View>
                               }

                               <View>
                               <Text style={ text.autoBlack}>Already Received Confirmation Code</Text>
                               <TouchableOpacity
                                style={ buttons.autoBlueButton }
                                onPress={ () => this.props.navigation.navigate('ConfirmManager')}
                                >                                    
                                    <Text style={ text.autoWhite}>Click Here</Text>
                                </TouchableOpacity>
                               </View>

                               <View style={ layout.padBottom }></View>
   
                           </View>
                   }
                </ScrollView>
            )
         }
     }
 }

