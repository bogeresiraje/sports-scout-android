import React, { Component } from 'react';
import { Text, ScrollView, View, TouchableOpacity, Image, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import LoadingIndicator from '../Helper/LoadingIndicator';
import SomethingWentWrong from '../Helper/SomethingWentWrong';
import layout from '../../res/styles/layout';
import { getHost, get, send } from '../../data/fetch';
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
            scouts: [],
            userId: 0,
            userStatus: '',
        }
    }
    
    componentWillMount(){
        this.setState({ loading: true });
    }

    componentDidMount(){
        this._fetchAuth();
    }

    _fetchAuth = async () => {
        try {
            const userId = await AsyncStorage.getItem('app_user');
            this._setAuth(userId);
        }catch(err){
            //alert(err)
        }
    }

    _setAuth = async (userId) => {
        try {
            const status = await AsyncStorage.getItem('status');
            if(status && userId){
                this.setState({ userStatus: status, userId: userId });
                this._fetchScouts();
            }
            // alert('wrrr')
        }catch(err){
            // err
        }
    }

    _fetchScouts = async () => {
        const formData = new FormData();
        formData.append('user_id', this.state.userId);
        formData.append('user_status', this.state.userStatus);

        await send('/get_all_scouts', formData)
            .then(
                response => {
                    if(response.scouts){
                        this.setState({ scouts: response.scouts, loading: false,
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
        get('/get_all_scouts')
            .then(
                response => {
                    if(response.scouts){
                        this.setState({ scouts: response.scouts, refreshing: false,
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
        this._fetchScouts();
    };

    render(){
        const { loading, somethingWrong, scouts, refreshing } = this.state;

        if(loading) { return <LoadingIndicator />}

        else if(somethingWrong){ return <SomethingWentWrong tryAgain={ this._tryAgain }/> }

        else return (
            <ScrollView
                style={ layout.paddlessContainer }
                refreshControl = {
                    <RefreshControl
                        refreshing={ refreshing }
                        onRefresh={ this._refreshScouts }
                    />
                }
            >
                <View style={ layout.container }>
                {
                    scouts.length ?
                        scouts.map((scout, i) => (
                            <Scout
                                key={ i }
                                scout={ scout }
                                navigation={ this.props.navigation }
                            />
                        ) ):

                        <View style={ layout.justifyMaxGrey }>
                        </View>
                }
                </View>

                <View style={ layout.padBottom }></View>

            </ScrollView>
        )
    }
}


const Scout = ({ scout }) => (
        <View style={ cards.card }>
            <View style={ layout.columnSeparator }>
                <View style={ layout.column20 }>
                    <Image
                        style={ image.roundMediumImage }
                        source={ {uri: `${getHost.host}/uploads/user_images/${scout.image_name}`}}
                    />
                </View>

                <View style={ layout.column80 }>
                    <Text style={ text.leftBlackHeading }>
                        {
                            `${scout.first_name} ${scout.last_name }`
                        }
                    </Text>
                    <Text style={ text.mediumBlack }>{ scout.email }</Text>
                    <Text style={ text.leftPaddedMediumBlack }>Uganda</Text>
                </View>
            </View>
        </View>
)
