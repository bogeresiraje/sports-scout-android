import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import LoadingIndicator from '../Helper/LoadingIndicator';
import SomethingWentWrong from '../Helper/SomethingWentWrong';
import layout from '../../res/styles/layout';
import image from '../../res/styles/image';
import text from '../../res/styles/text';


 export default class Feedback extends Component {
     constructor(props) {
         super(props);
         this.state = {
             loading: false,
             somethingWrong: false,
             about: '',
         }
     }

     componentWillMount() {
         this.setState({ loading: true });
     }

     componentDidMount() {
         this.setState({ loading: false });
     }

     render() {
         const { loading, somethingWrong, about } = this.state;

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
                 <View style={ layout.justifyMaxGrey } >
                     <View style={ layout.column100 }>
                     <Image
                        style={ image.roundMediumImage }
                        source={ require('../../res/icons/logo.png') }
                     />
                     </View>

                    <View style={ layout.column100 }>
                    <Text style={ text.autoBlack }>
                        We are a soccer scouting platform bringing detailed player and team statistics closer to you
                    </Text>
                    </View>

                    <View style={ layout.padBottom }></View>
                    <Text style={ text.autoBlack }>Our vision is to offer our users the best decision making companion in team management</Text>
                 </View>
             )
         }
     }
 }