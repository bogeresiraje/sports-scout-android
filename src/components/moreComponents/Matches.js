import React, { Component } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { get } from '../../data/fetch';
import LoadingIndicator from '../LoadingIndicator';
import SomethingWentWrong from '../SomethingWentWrong';
import cards from '../../res/styles/cards';
import layout from '../../res/styles/layout';
import inputStyles from '../../res/styles/input';


export default class MatchesList extends Component {
     constructor(props) {
         super(props);
         this.state = {
             refreshing: false,
             matches: [],
             loading: false,
             somethingWrong: false,
         }
     }

     componentWillMount() {
         this.setState({ loading: true });
     }

     componentDidMount() {
         this.setState({ loading: true });
         this.fetch_matches();
     }

     _onRefresh = async () => {
         this.setState({ refreshing: true });
         await get('/get_matches')
            .then(
                response => {
                    const matches = response.matches;
                    this.setState({ matches: matches, refreshing: false })
                },
                () => { this.setState({ somethingWrong: true } ) }
            )
            .catch(() => { this.setState({ loading: false, somethingWrong: true } ) } )
     }

     fetch_matches = () => {
         this.setState({ loading: true});
         get('/get_matches')
            .then(
                response => response.matches,
                () => { this.setState({ loading: false, somethingWrong: true })}
            )
            .then(matches => { this.setState({ loading: false, matches: matches })})
            .catch(() => { this.setState({ loading: false, somethingWrong: true })})
     }

     tryAgain = () => { this.fetch_matches() }

     render() {
         const { loading, somethingWrong, matches } = this.state;
         if(loading){ return (<LoadingIndicator />)}
         else if(somethingWrong){ return (<SomethingWentWrong tryAgain={ this.tryAgain } />)}
         else {
             return (
                 <ScrollView
                 refreshControl={
                        <RefreshControl
                            refreshing={ this.state.refreshing }
                            onRefresh={ this._onRefresh }
                        />
                    }
                 >
                     {
                         matches.map((match, i) => (
                             <Match
                                key={ i }
                                match={ match }
                             />
                         ))
                     }
                 </ScrollView>
             )
         }
     }
 }


 const Match = ({ match }) =>
    (
        <View style={ cards.card } >
            <View style={ layout.columnSeparator}>
                <View style={ layout.column45 }>
                    <Text style={ inputStyles.leftBlackTextBold }>{ match.home }</Text>
                </View>
                <View style={ layout.column10 }>
                    <Text>Vs</Text>
                </View>
                <View style={ layout.column45 }>
                    <Text style={ inputStyles.rightBlackTextBold }>{ match.away }</Text>
                </View>
            </View>

            <View>
                <Text style={ inputStyles.dullBlackTextBold }>{ match.stadium }</Text>
            </View>

            <View>
                <Text>{ match.timestamp }</Text>
            </View>
        </View>
    )