import  React, { Component } from "react";
import { ScrollView, View, TouchableOpacity, Image, Text, ToastAndroid } from 'react-native';
import LoadingIndicator from "../Helper/LoadingIndicator";
import SomethingWentWrong from "../Helper/SomethingWentWrong";
import layout from "../../res/styles/layout";
import cards from '../../res/styles/cards';
import text from '../../res/styles/text';
import image from '../../res/styles/image';
import { getHost, send } from "../../data/fetch";


export default class extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            somethingWrong: false,
            club: {},
        };
    }

    componentWillMount(){
        this.setState({ loading: true, somethingWrong: false });
    }

    componentDidMount(){
        this._fetchDetailedClub();
    }

    _fetchDetailedClub = async () => {
        const formData = new FormData();
        formData.append('club_id', this.props.navigation.getParam('clubId'));

        await send('/get_detailed_club', formData)
            .then(
                response => {
                    if(response.club){
                        this.setState({ loading: false, somethingWrong: false, club: response.club });

                        // If toast mesage exists
                        if(this.props.navigation.getParam('toastMessage')){
                            // toast
                            ToastAndroid.showWithGravity(
                                this.props.navigation.getParam('toastMessage'),
                                ToastAndroid.LONG,
                                ToastAndroid.TOP,
                            )
                        }

                    }else{
                        this.setState({ loading: false, somethingWrong: true })
                    }
                },
                () => this.setState({ loading: false, somethingWrong: true })
            )
            .catch(() => this.setState({ loading: false, somethingWrong: true }))
    }

    _tryAgain = () => {
        this._fetchDetailedClub();
    }

    render(){
        const { loading, somethingWrong, club } = this.state;

        if(loading){ return (<LoadingIndicator />)}
        else if(somethingWrong){ return (<SomethingWentWrong tryAgain={ this._tryAgain } />)}
        else {
            return (
                <ScrollView style={ layout.paddlessContainer }>
                    <View style={ layout.container }>
                        
                        <Text style={ text.centerHeadingArmyGreen }>{ club.name }</Text>
                        <Text style={ text.autoBlack }>{ club.league }</Text>
                        <Text style={ text.autoGreen }>{ `Rating: ${club.ave_rating}` }</Text>
                        
                        <View style={ layout.padBottom }></View>
                        <Text style={ text.centerBlackHeading }>MANAGER</Text>
                        {
                            club.manager.id?
                                <Manager manager={ club.manager } />:
                                <Text style={ text.autoGreen }>No Manager</Text>
                        }

                        <View style={ layout.padBottom }></View>
                        <Text style={ text.centerBlackHeading }>PLAYERS</Text>
                        {
                            club.players.length?
                                club.players.map((player, index) => (
                                <Player
                                    key = { index }
                                    navigation={ this.props.navigation }
                                    player={ player }
                                />
                                )):

                                <Text style={ text.autoGreen }>No Players</Text>
                        }
                    </View>
                </ScrollView>
            )
        }
    }
}


const Manager = ({ manager }) => (
    <View style={ cards.card }>
        <View style={ layout.columnSeparator }>
            <View style={ layout.column20 }>
                <Image
                    style={ image.roundMediumImage }
                    source={ {uri: `${getHost.host}/uploads/user_images/${manager.image_name}`}}
                />
            </View>

            <View style={ layout.column80 }>
                <Text style={ text.leftBlackHeading }>
                    {
                        `${manager.first_name} ${manager.last_name}`
                    }
                </Text>

                <Text style={ text.mediumBlack }>{ manager.email }</Text>

            </View>
        </View>
    </View>
)



const Player = ({ player, navigation }) => (
    <TouchableOpacity
       onPress={ () => navigation.navigate('PlayerProfile', { 'playerId': player.id }) }
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
               <Text style={ text.leftBlackHeading }>
                   { `${player.first_name} ${player.last_name }` }
               </Text>

               <Text style={ text.leftPaddedBlack }>{ player.role }</Text>

               <Text style={ text.leftPaddedGreen }>
                       { `Rating: ${player.curr_perf}`}
               </Text>
               </View>
           </View>
       </View>
    </View>
    </TouchableOpacity>
)