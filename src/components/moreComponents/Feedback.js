import React, { Component } from 'react';
import { View, Text } from 'react-native';
import LoadingIndicator from '../LoadingIndicator';
import SomethingWentWrong from '../SomethingWentWrong';
import layout from '../../res/styles/layout';

 export default class Feedback extends Component {
     constructor(props) {
         super(props);
         this.state = {
             loading: false,
             somethingWrong: false,
             feedbackInfo: '',
         }
     }

     componentWillMount() {
         this.setState({ loading: true });
     }

     componentDidMount() {
         this.fetchFeedBackInfo();
     }

     fetchFeedBackInfo = () => {
         this.setState({ loading: true });
         // pass
     }

     tryAgain = () => { this.fetchFeedBackInfo() }

     render() {
         const { loading, somethingWrong, feedbackInfo } = this.state;

         if(loading) {
             return (
                 <LoadingIndicator />
             )
         } else if(somethingWrong) {
             return (
                 <SomethingWentWrong tryAgain={ this.tryAgain } />
             )
         } else {
             return (
                 <View style={ layout.container} >
                    <Text>Foo</Text>
                 </View>
             )
         }
     }
 }