import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { getHost, send } from '../../data/fetch';
import LoadingIndicator from '../Helper/LoadingIndicator';
import SomethingWentWrong from '../Helper/SomethingWentWrong';
import layout from '../../res/styles/layout';
import text from '../../res/styles/text';
import image from '../../res/styles/image';
import buttons from '../../res/styles/buttons';
import cards from '../../res/styles/cards';



export default class extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            somethingWrong: false,

            players: [],
        };
    }

    componentWillMount(){
        this.setState({ loading: true, somethingWrong: true });
    }

    componentDidMount(){
        this._loadPlayers();
    }

    _loadPlayers = async () => {
        const managerId = await AsyncStorage.getItem('app_user');
        this._fetchPlayers(managerId);
    };

    _fetchPlayers = async managerId => {
        const formData = new FormData();
        formData.append('manager_id', managerId);

        await send('/get_my_players', formData)
            .then(
                response => {
                    if(response.players){
                        this.setState({ loading: false, somethingWrong: false,
                            players: response.players, clubName: response.club_name
                        });
                    }else {
                        this.setState({ loading: false, somethingWrong: true });
                    }
                },
                () => this.setState({ loading: false, somethingWrong: true })
            )
            .catch(() => this.setState({ loading: false, somethingWrong: true }) )
    };

    _deletePlayer = (playerId) => {
        Alert.alert(
            'Delete Player',
            'Are You Sure You Want to Delete This Player?',
            [
                {
                    text: 'cancel',
                    onPress: f => f
                },
                {
                    text: 'ok',
                    onPress: () => this._delete(playerId)
                }
            ],
            {
                cancelable: false,
            }
        )
    }

    _delete = async (playerId) => {
        this.setState({ loading: true, somethingWrong: false });
        const formData = new FormData();
        formData.append('player_id', playerId)

        await send('/delete_player', formData)
            .then(
                response => {
                    if(response.player_id){
                        this.setState({ loading: false, somethingWrong: false,
                            players: this.state.players.filter(player => (
                                player.id !== response.player_id
                            ))
                        });
                    }else{
                        this.setState({ loading: false, somethingWrong: true });
                    }
                },
                () => this.setState({ loading: false, somethingWrong: true })
            )
            .catch(() => this.setState({ loading: false, somethingWrong: true }) )
    };

    _tryAgain = () => {
        this.setState({ loading: true, somethingWrong: false });
        this._fetchPlayers();
    };

    render(){
        const { loading, somethingWrong, players, clubName } = this.state;

        if(loading){ return <LoadingIndicator /> }

        else if(somethingWrong){ return <SomethingWentWrong tryAgain={ this._tryAgain } /> }

        else {
            if(!players.length){
                return (
                    <View style={ layout.justifyMaxGrey }>
                        <Text style={ text.autoBlue }>No Players For This Club</Text>
                        <Text style={ text.autoBlue }>That Have Been Added</Text>
                    </View>
                );
            } else {
                return (
                    <ScrollView
                        style={ layout.paddlessContainer }
                    >
                        <View style={ layout.container }>

                            <Text style={ text.centerHeadingArmyGreen }>{ clubName }</Text>

                            {
                                players.map((player, index) => (
                                    <Player
                                        key={ index }
                                        player={ player }
                                        navigation={ this.props.navigation }
                                        deletePlayer={ this._deletePlayer }
                                    />
                                ))
                            }
                        </View>
                    </ScrollView>
                )
            }
        }
    }
}


const Player = ({ player, navigation, deletePlayer }) => (

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

       <View style={ layout.columnSeparator99 }>
           <View style={ layout.column33 }>
               <TouchableOpacity
                    style={ buttons.rectGreyBorder }
                    onPress={ () => navigation.navigate('PlayerProfile', { 'playerId': player.id,
                        'playerName': `${player.first_name} ${player.last_name}`
                 }) }
               >
                   <Text style={ text.autoGrey }>details</Text>
               </TouchableOpacity>
           </View>

           <View style={ layout.column33 }>
               <TouchableOpacity
                    style={ buttons.rectGreyBorder }
                    onPress={ () => navigation.navigate('EditPlayer', { 'playerId': player.id }) }
               >
                   <Text style={ text.autoGrey }>edit</Text>
               </TouchableOpacity>
           </View>

           <View style={ layout.column33 }>
               <TouchableOpacity
                    style={ buttons.rectGreyBorder }
                    onPress={ () => deletePlayer(player.id) }
               >
                   <Text style={ text.autoGrey }>delete</Text>
               </TouchableOpacity>
           </View>
       </View>

        </View>
)
