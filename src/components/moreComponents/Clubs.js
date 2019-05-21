import React, { Component} from 'react';
import { ScrollView, View, TouchableOpacity, Text, RefreshControl, Image } from 'react-native';
import LoadingIndicator from '../LoadingIndicator';
import SomethingWentWrong from '../SomethingWentWrong';
import layout from '../../res/styles/layout';
import text from '../../res/styles/text';
import input from '../../res/styles/input';
import { get, getHost } from '../../data/fetch';
import cards from '../../res/styles/cards';
import image from '../../res/styles/image';
import buttons from '../../res/styles/buttons';


export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            refreshing: false,
            somethingWrong: false,
            clubs: [],
        };
    }

    componentWllMount() {
        this.setState({ loading: true });
    }

    componentDidMount() {
        this._fetch_all_clubs();
    }

    _fetch_all_clubs = async () => {
        try{
            await get('/get_all_clubs')
                .then(
                    response => {
                        if(response.clubs){
                            this.setState({ loading: false, somethingWrong: false, clubs: response.clubs });
                        } else if(response.fail) {
                            // Some thing wrong with the server
                            this.setState({ loading: false, somethingWrong: true });
                        }
                    },
                    () => this.setState({ loading: false, somethingWrong: true })
                )
                .catch(error => {
                    // Something wrong
                    this.setState({ loading: false, somethingWrong: true });
                })
        } catch(error) {
            // Do nothing
        }
    }

    _onRefresh = async () => {
        this.setState({ refreshing: true });
        try{
            await get('/get_all_clubs')
                .then(
                    response => {
                        if(response.clubs){
                            this.setState({ refreshing: false, somethingWrong: false, clubs: response.clubs });
                        } else if(response.fail) {
                            // Some thing wrong with the server
                            this.setState({ refreshing: false, somethingWrong: true });
                        }
                    },
                    () => this.setState({ refreshing: false, somethingWrong: true })
                )
                .catch(error => {
                    // Something wrong
                    this.setState({ refreshing: false, somethingWrong: true });
                })
        } catch(error) {
            // Do nothing
        }
    }

    _tryAgain = () => {
        this.setState({ loading: true });
        this._fetch_all_clubs();
    }

    render() {
        const { navigation } = this.props;
        const { loading, somethingWrong, clubs, refreshing } = this.state;
            return (
                <View style={ layout.paddlessContainer }>
                    <View style={ layout.container }>
                        <TouchableOpacity
                            style={ buttons.greyButton }
                            onPress={ () => navigation.navigate('AddClub') } 
                        >
                            <Text  style={ text.autoWhite } >add new club</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={ layout.container }>
                        <TouchableOpacity
                            style={ buttons.greyButton }
                            onPress={ () => navigation.navigate('DeleteClub') } 
                        >
                            <Text  style={ text.autoWhite } >delete club</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={ layout.inScrollContainer }
                        refreshControl={
                            <RefreshControl
                                refreshing={ refreshing }
                                onRefresh={ this._onRefresh }
                            />
                        }
                    >
                        <View style={ layout.container }>
                        {
                            loading ?
                                <LoadingIndicator />:

                                somethingWrong ?
                                    <SomethingWentWrong tryAgain={ this._tryAgain} /> :
                            
                            clubs.length ?
                                clubs.map(club => 
                                    <Club club={ club } key={ club.id } />
                                ) :
                                <View style={ layout.alignCenter }>
                                        <Text style={ text.autoBlue } >No Clubs</Text>
                                </View>
                        }
                        </View>

                    </ScrollView>

                </View>
            )
    }
}


const Club = ({ club }) => (
    <View style={ cards.card } >
        <View style={ layout.columnSeparator }>
            <View style={ layout.column50Fixed} >
                <Image
                    style={ image.roundMediumImage }
                    source={ {uri: `${getHost.host}/uploads/club_logos/${club.logo_name}`}}
                />
            </View>
            <View style={ layout.column90 }>
                <Text style={ text.headingArmyGreen }>{ club.name }</Text>
                <Text style={ text.leftPaddedMediumBlack }>{ `${club.num_players} Players` }</Text>
            </View>
        </View>

        <View>
            <Text style={ text.armyGreen }>{ club.league }</Text>
        </View>

    </View>
)
