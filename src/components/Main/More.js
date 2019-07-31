import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';

import cards from '../../res/styles/cards';
import layout from '../../res/styles/layout';
import text from '../../res/styles/text';
import image from '../../res/styles/image';
import LoadingIndicator from '../Helper/LoadingIndicator';
import SomethingWentWrong from '../Helper/SomethingWentWrong';
import buttons from '../../res/styles/buttons';
import { send } from '../../data/fetch';


class More extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            somethingWrong: false,
        };
        this._checkUserStatus();
        
    }

    _checkUserStatus = async () => {
        try{
            const status = await AsyncStorage.getItem('status');
            if(status){
                this.setState({ status: status})
            }else {
                this.props.navigation.navigate('Auth');
            }
        } catch(err){
            this.props.navigation.navigate('Auth');
        }
    }

    _confirm = () => {
        Alert.alert(
            'Logout',
            'Are You Sure You Want To Logout?',
            [
                {
                    text: 'Cancel',
                    onPress: f => f
                },
                {
                    text: 'OK',
                    onPress: () => this._logout()
                }
            ],
            {
                cancelable: false,
            }
        )
    }

    _logout = async () => {
        this.setState({ loading: true, somethingWrong: false });
        const username = await AsyncStorage.getItem('app_user');
        if(username !== null){
           this._logoutFromServer(username);
        } else {
            this.props.navigation.navigate('Auth');
        }
    }

    _logoutFromServer = async username => {
        const formData = new FormData();
        formData.append('username', username);

        await send('/logout', formData)
            .then(
                response => {
                    if(response.success){
                        this._logoutFromLocalStorage();
                    }else {
                        this.setState({ loading: false, somethingWrong: true });
                    }
                },
                () => this.setState({ loading: false, somethingWrong: true })
            )
            .catch(() => this.setState({ loading: false, somethingWrong: true }))
    }

    _logoutFromLocalStorage = async () => {
        try{
            await AsyncStorage.clear();
            this.props.navigation.navigate('Auth');
        }catch(err){
            this.props.navigation.navigate('Auth');
        }
    }

    _tryAgain = () => {
        this._logout();
    };

    render() {
        const { loading, somethingWrong, status } = this.state;

        if(loading) {
            return (
                <LoadingIndicator />
            );
        } else if(somethingWrong){
            return (
                <SomethingWentWrong tryAgain={ this._tryAgain } />
            );
        } else {
            return (
                <ScrollView style={ layout.container }>
                    <TouchableOpacity
                        style={ buttons.rectLightGreyButton }
                        onPress={ () => this._confirm() }
                    >
                        <View style={ layout.columnSeparatorGrey }>
                            <View style={ layout.column20Grey }>
                                <Image
                                    style={ image.icon }
                                    source={require('../../res/icons/logout.png')}
                                />
                            </View>
    
                            <View style={ layout.column80Grey } >
                                <Text style={ text.leftPaddedMediumBlack }>Log Out</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={ buttons.rectLightGreyButton }
                        onPress={ () => this.props.navigation.navigate('Profile') }
                    >
                        <View style={ layout.columnSeparatorGrey }>
                            <View style={ layout.column20Grey }>
                                <Image
                                    style={ image.icon }
                                    source={require('../../res/icons/profile.png')}
                                />
                            </View>
    
                            <View style={ layout.column80Grey } >
                                <Text style={ text.leftPaddedMediumBlack }>Profile</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={ buttons.rectLightGreyButton }
                        onPress={ () => this.props.navigation.navigate('FilterPlayers') }
                    >
                        <View style={ layout.columnSeparatorGrey }>
                            <View style={ layout.column20Grey }>
                                <Image
                                    style={ image.icon }
                                    source={require('../../res/icons/player.png')}
                                />
                            </View>
    
                            <View style={ layout.column80Grey } >
                                <Text style={ text.leftPaddedMediumBlack }>Filter Players</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={ buttons.rectLightGreyButton }
                        onPress={ () => this.props.navigation.navigate('Managers') }
                    >
                        <View style={ layout.columnSeparatorGrey }>
                            <View style={ layout.column20Grey }>
                                <Image
                                    style={ image.icon }
                                    source={require('../../res/icons/technical.png')}
                                />
                            </View>
    
                            <View style={ layout.column80Grey } >
                                <Text style={ text.leftPaddedMediumBlack }>Managers</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={ buttons.rectLightGreyButton }
                        onPress={ () => this.props.navigation.navigate('Scouts') }
                    >
                        <View style={ layout.columnSeparatorGrey }>
                            <View style={ layout.column20Grey }>
                                <Image
                                    style={ image.icon }
                                    source={require('../../res/icons/technical.png')}
                                />
                            </View>
    
                            <View style={ layout.column80Grey } >
                                <Text style={ text.leftPaddedMediumBlack }>Scouts</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={ buttons.rectLightGreyButton }
                        onPress={ () => { this.props.navigation.navigate('Clubs')} }
                    >
                        <View style={ layout.columnSeparatorGrey }>
                            <View style={ layout.column20Grey }>
                                <Image
                                    style={ image.icon }
                                    source={require('../../res/icons/match.png')}
                                />
                            </View>
    
                            <View style={ layout.column80Grey } >
                                <Text style={ text.leftPaddedMediumBlack }>Clubs</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {
                        status === 'manager' ?
                        <View>
                            <TouchableOpacity
                                style={ buttons.rectLightGreyButton }
                                onPress={ () => this.props.navigation.navigate('AddPlayer') }
                            >
                                <View style={ layout.columnSeparatorGrey }>
                                    <View style={ layout.column20Grey }>
                                    <Image
                                        style={ image.icon }
                                        source={require('../../res/icons/player.png')}
                                    />
                                    </View>
    
                                    <View style={ layout.column80Grey } >
                                        <Text style={ text.leftPaddedMediumBlack }>Add Player</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={ buttons.rectLightGreyButton }
                                onPress={ () => this.props.navigation.navigate('MyClubPlayers') }
                            >
                                <View style={ layout.columnSeparatorGrey }>
                                    <View style={ layout.column20Grey }>
                                    <Image
                                        style={ image.icon }
                                        source={require('../../res/icons/player.png')}
                                    />
                                    </View>
    
                                    <View style={ layout.column80Grey } >
                                        <Text style={ text.leftPaddedMediumBlack }>My Club Players</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>:


                            <TouchableOpacity
                                style={ buttons.rectLightGreyButton }
                                onPress={ () => this.props.navigation.navigate('AddStats') }
                            >
                                <View style={ layout.columnSeparatorGrey }>
                                    <View style={ layout.column20Grey }>
                                    <Image
                                        style={ image.icon }
                                        source={require('../../res/icons/statistics.png')}
                                    />
                                    </View>

                                    <View style={ layout.column80Grey } >
                                        <Text style={ text.leftPaddedMediumBlack }>Add Statistics</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                    }

                    <TouchableOpacity
                        style={ buttons.rectLightGreyButton }
                        onPress={ () => this.props.navigation.navigate('About') }
                    >
                        <View style={ layout.columnSeparatorGrey }>
                            <View style={ layout.column20Grey }>
                                <Image
                                    style={ image.icon }
                                    source={require('../../res/icons/about.png')}
                                />
                            </View>
    
                            <View style={ layout.column80Grey } >
                                <Text style={ text.leftPaddedMediumBlack }>About Sports Scout</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <View style={ layout.padBottom }></View>
                    
                </ScrollView>
            );
        }
    }
};

More.propTypes = {
    navigation: PropTypes.object.isRequired,
}

export default More;
