import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
import LoadingIndicator from '../LoadingIndicator';
import SomethingWentWrong from '../SomethingWentWrong';
import { get } from '../../data/fetch';
import layout from '../../res/styles/layout';
import text from '../../res/styles/text';
import cards from '../../res/styles/cards';


 export default class Statistics extends Component {
     constructor(props) {
         super(props);
         this.state = {
             loading: false,
             somethingWrong: false,

             topScorers: [],
             topAssists: [],
             topYellow: [],
             topRed: [],
         }
     }

     componentWillMount() {
         this.setState({ loading: true });
     }

     componentDidMount() {
         this.fetchStatistics()
     }

     fetchStatistics = () => {
         this.setState({ loading: true });
        get('/get_statistics')
            .then(
                response => {
                    this.setState({ 
                        topScorers: response.top_scorers_list,
                        topAssists: response.top_assists_list,
                        topYellow: response.top_yellow_list,
                        topRed: response.top_red_list,
                        loading: false,
                    })
                },
                () => { this.setState({ loading: false, somethingWrong: true })}
            )
            .catch(() => this.setState({ loading: false, somethingWrong: true }))
            
     }

     tryAgain = () => { this.fetchStatistics() }

     render() {
         const { loading, somethingWrong, topScorers, topAssists, topRed, topYellow } = this.state;

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
                 <ScrollView style={ layout.container }>
                     <View style={ cards.card } >
                         <Text style={ text.centerBoldText } >TOP SCORERS</Text>

                         <Title identifier='Goals' />

                         {
                             topScorers.map((player, id) => (
                                 <ListData
                                    key={ id }
                                    player={ player }
                                 />
                             ))
                         }
                     </View>

                     <View style={ cards.card  } >
                         <Text style={ text.centerBoldText } >TOP ASSISTS</Text>

                         <Title identifier='Assists' />

                         {
                             topAssists.map((player, id) => (
                                 <ListData
                                    key={ id }
                                    player={ player }
                                 />
                             ))
                         }
                     </View>

                     <View style={ cards.card  } >
                         <Text style={ text.centerBoldText } >TOP YELLOW CARDS</Text>

                         <Title identifier='Yellow Cards' />

                         {
                             topYellow.map((player, id) => (
                                 <ListData
                                    key={ id }
                                    player={ player }
                                 />
                             ))
                         }
                     </View>

                     <View style={ cards.card  } >
                         <Text style={ text.centerBoldText } >TOP RED CARDS</Text>

                         <Title identifier='Red Cards' />

                         {
                             topRed.map((player, id) => (
                                 <ListData
                                    key={ id }
                                    player={ player }
                                 />
                             ))
                         }
                     </View>

                     <View style={ layout.sectionContainer } ></View>

                 </ScrollView>
             )
         }
     }
 }

 const Title = ({ identifier }) => (
    <View style={ layout.columnSeparator }>
       <View style={ layout.column50 } >
           <Text style={ text.leftDarkText } >Name</Text>
       </View>

       <View style={ layout.column50 } >
           <Text style={ text.rightDarkText }>{ identifier }</Text>
       </View>
    </View>
)

 const ListData = ({ player }) => (
     <View style={ layout.columnSeparator }>
        <View style={ layout.column50 } >
            <Text style={ text.leftText }>{ player.name }</Text>
        </View>

        <View style={ layout.column50 } >
            <Text style={ text.rightText }>{ player.value }</Text>
        </View>
     </View>
 )