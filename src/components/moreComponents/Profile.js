import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import LoadingIndicator from '../LoadingIndicator';
import SomethingWentWrong from '../SomethingWentWrong';
import Store from '../../data/store';


 export default class Partners extends Component {
     constructor(props) {
         super(props);
         this.state = {
             loading: true,
             somethingWrong: false,
             loggedIn: false,
         }
     }

     componentDidMount() {
         this.setState({ loading: false });
     }

     logIn = () => { this.props.navigation.navigate('Login') };

     render() {
         if(this.state.loading) {
             return (
                 <LoadingIndicator />
             );
         } else if(this.state.somethingWrong) {
             return (
                 <SomethingWentWrong tryAgain = { this.tryAgain } />
             );
         } else if(this.state.loggedIn) {
             return (
                 <ScrollView></ScrollView>
             )
         } else {
             return (
                 <View style = { inputStyles.autoContent }>
                     <Text>You Are Currently Not Logged In</Text>
                     <TouchableOpacity onPress={ () => this.logIn() } >
                        <Text style={ inputStyles.blueText }>Login</Text>
                     </TouchableOpacity>
                 </View>
             )
         }
     }
 }