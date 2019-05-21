import React, { Component } from 'react';
import { View, Text, ScrollView, Image, RefreshControl } from 'react-native';
import { get } from '../data/fetch';
import cards from '../res/styles/cards';
import text from '../res/styles/text';
import { getHost } from '../data/fetch';


 export default class PlayerList extends Component {
     constructor(props) {
         super(props);
         this.state = {
             refreshing: false,
             players: [],
             loading: true,
             somethingWrong: false,
         }
     }

     componentDidMount() {
         this.fetch_players();
     }

     _onRefresh = async () => {
         this.setState({ refreshing: true });
         await get('/get_players_list')
            .then(
                response => {
                    const players = response.players;
                    this.setState({ players: players, refreshing: false } );
                },
                () => { this.setState({ somethingWrong: true } ) }
            )
            .catch(() => { this.setState({ somethingWrong: true } ) })
     }

     fetch_players = async () => {
        this.setState({ loading: true });
        await get('/get_players_list')
            .then(
                response => response.players,
                () => { this.setState({ loading: false, somethingWrong: true } ) }
            )
            .then(
                players => { this.setState({ players: players, loading: false } ) },
                () => { this.setState({ loading: false, somethingWrong: true } ) }
            )
            .catch(() => { this.setState({ loading: false, somethingWrong: true } ) })
     }

     tryAgain = () => { this.fetch_players(); }

     render() {
       const { loading, players, somethingWrong } = this.state;
       if(loading) {
           return (
            <LoadingIndicator /> 
           );
       } else if(somethingWrong) {
           return (
               <SomethingWentWrong tryAgain={ this.tryAgain } />
           );
       } else {
            const length = players.length;
            let mid = Math.floor(length / 2);
            mid = mid === 0 ? Math.ceil(length / 2): mid;
            const left = players.slice(0, mid);
            const right = players.slice(mid, length);
            return (
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={ this.state.refreshing }
                            onRefresh={ this._onRefresh }
                        />
                    }
                >

                    <View style={ cards.twoColumn }>
                                        <View style={ cards.column }>
                                            {
                                                left.map((player, index) => (
                                                    <Player
                                                        player={ player } 
                                                        key={ index } 
                                                        navigation={ this.props.navigation }
                                                    />
                                            )) 
                                            }
                                        </View>

                                        <View style={ cards.column }>
                                            {
                                                right.map((player, index) => (
                                                    <Player
                                                        player={ player } 
                                                        key={ index } 
                                                        navigation={ this.props.navigation }
                                                    />
                                            )) 
                                            }
                                        </View>
                                    </View>
                </ScrollView>
            )
       }
     }
 }

 const Player = ({ player }) => (
     <View style={ cards.profileCard } >
         <Text style={ text.centerBlackTitle }>{ player.name }</Text>
         <Image
            style={ cards.profileImage }
            source={{uri: `${getHost.host}/uploads/player_images/${player.image_url}`}}
         />
         <Text style={ text.centerDullBlack }>{ player.role }</Text>
     </View>
 )