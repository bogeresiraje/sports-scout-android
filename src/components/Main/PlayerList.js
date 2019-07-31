import React, { Component } from 'react';
import { View, Text, ScrollView, Image, RefreshControl, BackHandler,
    TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import LoadingIndicator from '../Helper/LoadingIndicator';
import SomethingWentWrong from '../Helper/SomethingWentWrong';
import { get, send } from '../../data/fetch';
import cards from '../../res/styles/cards';
import text from '../../res/styles/text';
import { getHost } from '../../data/fetch';
import layout from '../../res/styles/layout';
import image from '../../res/styles/image';


 export default class PlayerList extends Component {
     constructor(props) {
         super(props);
         this.state = {
             refreshing: false,
             players: [],
             loading: false,
             somethingWrong: false,
         }
     }

     componentWillMount() {
        this.setState({ loading: true })
     }


     componentDidMount() {
         this._fetchPlayers();
     }

     _onRefresh = async () => {
        this.setState({ refreshing: true });
        try {
            const username = await AsyncStorage.getItem('app_user');
            if(username !== null){
                const formData = new FormData();
                formData.append('username', username);

                this._refreshHandle('/get_custom_players', formData);
            } else {
                const formData = new FormData();
                this._refreshHandle('/get_generic_players', formData);
            }
        }catch(err){ this.setState({ loading: false, somethingWrong: true }) }
     }

     _refreshHandle = async (url, formData) => {
        await send(url, formData)
            .then(
                response => {
                    if(response.players){
                        const players = response.players;
                        this.setState({ players: players, refreshing: false });
                    }else {
                        this.setState({ refreshing: false, somethingWrong: true })
                    }
                },
                () => { this.setState({ refreshing: false, somethingWrong: true }) }
            )
            .catch(() => { this.setState({ refreshing: false, somethingWrong: true }) })
     }



     _fetchPlayers = async () => {
        this.setState({ loading: true });
        try {
            const username = await AsyncStorage.getItem('app_user');
            if(username !== null){
                const formData = new FormData();
                formData.append('username', username);

                this._fetchHandle('/get_custom_players', formData);
            } else {
                const formData = new FormData();
                this._fetchHandle('/get_generic_players', formData);
            }
        }catch(err){ 
            this.setState({ loading: false, somethingWrong: true }) }
     }

     _fetchHandle = async (url, FormData) => {
        await send(url, FormData)
            .then(
                response => {
                    if(response.players){
                        this.setState({ loading: false, somethingWrong: false, players: response.players } )
                    } else {
                        this.setState({ loading: false, somethingWrong: true })
                    }
                },
                () => { this.setState({ loading: false, somethingWrong: true } ) }
            )
            .catch((err) => { this.setState({ loading: false, somethingWrong: true } ) })
     }

     _tryAgain = () => { this._fetchPlayers(); }

     render() {
       const { loading, players, somethingWrong, refreshing } = this.state;
       if(loading) {
           return (
            <LoadingIndicator /> 
           );
       } else if(somethingWrong) {
           return (
               <SomethingWentWrong tryAgain={ this._tryAgain } />
           );
       } else {
            return (
                <ScrollView
                    style={ layout.paddlessContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={ refreshing }
                            onRefresh={ this._onRefresh }
                        />
                    }
                >

                    <View style={ layout.container }>
                    {
                        players.length ?
                            players.map((player, i) => (
                                <Player
                                    navigation={ this.props.navigation }
                                    player={ player }
                                    key={ i }
                                />
                            ))  :
                            <View></View>
                    }
                    </View>

                    <View style={ layout.padBottom }></View>

                </ScrollView>
            )
       }
     }
 }

 export const Player = ({ player, navigation }) => (
     <TouchableOpacity
        onPress={ () => navigation.navigate('PlayerProfile', { 'playerId': player.id,
            'playerName': `${player.first_name} ${player.last_name}`
     }) }
     >
        <View style={ cards.fixedMediumCard } >
        <View style={ layout.columnSeparator } >
            <View style={ layout.column30 }>
                <Image
                style={ image.rectMediumImage }
                source={{uri: `${getHost.host}/uploads/player_images/${player.photo_name}`}}
                />
            </View>

            <View>
                <View style={ layout.bottomPadContainer}>
                <Text style={ text.headingBlack }>
                    { `${player.first_name} ${player.last_name }` }
                </Text>

                <Text style={ text.leftPaddedBlack }>{ player.role }</Text>

                <Text style={ text.leftPaddedGreen }>
                        { `Rating: ${player.curr_perf}`}
                </Text>
                </View>

            </View>
        </View>

        <View style={ layout.topPadContainer } >
                    <Text style={ text.leftPaddedMediumBlack }>{ player.club.name }</Text>
                    <Text style={ text.leftPaddedBlack }>{ player.club.league }</Text>
        </View>
        
     </View>
     </TouchableOpacity>
 )