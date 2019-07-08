import React, { Component } from 'react';
import { Text, ScrollView, View, TouchableOpacity, Image, RefreshControl } from 'react-native';

import LoadingIndicator from '../Helper/LoadingIndicator';
import SomethingWentWrong from '../Helper/SomethingWentWrong';
import layout from '../../res/styles/layout';
import { send, getHost, get } from '../../data/fetch';
import cards from '../../res/styles/cards';
import text from '../../res/styles/text';
import image from '../../res/styles/image';


export default class extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            somethingWrong: false,
            refreshing: false,
            managers: [],
        }
    }
    
    componentWillMount(){
        this.setState({ loading: true });
    }

    componentDidMount(){
        this._fetchManagers();
    }

    _fetchManagers = async () => {
        get('/get_all_managers')
            .then(
                response => {
                    if(response.managers){
                        this.setState({ managers: response.managers, loading: false,
                            somethingWrong: false });
                    } else {
                        this.setState({ loading: false, somethingWrong: true });
                    }
                },
                () => this.setState({ loading: false, somethingWrong: true })
            )
            .catch(() => this.setState({ loading: false, somethingWrong: true }))
    }

    _refreshMangers = async () => {
        this.setState({ refreshing: true, somethingWrong: false })
        get('/get_all_managers')
            .then(
                response => {
                    if(response.managers){
                        this.setState({ managers: response.managers, refreshing: false,
                            somethingWrong: false });
                    } else {
                        this.setState({ refreshing: false, somethingWrong: true });
                    }
                },
                () => this.setState({ refreshing: false, somethingWrong: true })
            )
            .catch(() => this.setState({ refreshing: false, somethingWrong: true }))
    }

    _tryAgain = () => {
        this.setState({ loading: true, somethingWrong: false })
        this._fetchManagers();
    };

    render(){
        const { loading, somethingWrong, managers, refreshing } = this.state;

        if(loading) { return <LoadingIndicator />}

        else if(somethingWrong){ return <SomethingWentWrong tryAgain={ this._tryAgain }/> }

        else return (
            <ScrollView
                style={ layout.paddlessContainer }
                refreshControl = {
                    <RefreshControl
                        refreshing={ refreshing }
                        onRefresh={ this._refreshMangers }
                    />
                }
            >
                <View style={ layout.container }>
                {
                    managers.length ?
                        managers.map((manager, i) => (
                            <Manager
                                key={ i }
                                manager={ manager }
                                navigation={ this.props.navigation }
                            />
                        ) ):

                        <View style={ layout.justifyMaxGrey }>
                            <Text style={ text.autoBlue }>No Managers</Text>
                        </View>
                }
                </View>

                <View style={ layout.padBottom }></View>
                
            </ScrollView>
        )
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
                    <Text style={ text.leftPaddedHeadingArmyGreen }>
                        {
                            `${manager.first_name} ${manager.last_name}`
                        }
                    </Text>

                    <Text style={ text.mediumBlack }>{ manager.email }</Text>

                    <View style={ layout.columnSeparator }>
                        <View style={ layout.column20 }>
                            <Text style={ text.boldBlack }>CLUB</Text>
                        </View>

                        <View style={ layout.column80 }>
                            <Text style={ text.mediumBlack }>{ manager.club.name }</Text>
                        </View>
                    </View>

                    <Text style={ text.leftPaddedBlack }>{ manager.club.league }</Text>
                </View>
            </View>
        </View>
)
