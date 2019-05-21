import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import cards from '../res/styles/cards';
import layout from '../res/styles/layout';
import text from '../res/styles/text';
import image from '../res/styles/image';


class More extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
        };
        
    }

    componentDidMount() {
        this._checkLogin();
    }

    componentWillUnmount() {
        clearInterval(this._checkLogin)
    }

    _checkLogin = () => { setInterval(this._getCredentials, 100); }

    _getCredentials = async () => {
        const username = await AsyncStorage.getItem('user');
        if(username){
            this.setState({ loggedIn: true });
        } else {
            this.setState({ loggedIn: false });
        }
    }

    logout = async () => {
        try {
            await AsyncStorage.removeItem('user');
        } catch(err) {
            // no user in storage
        }
        this.setState({ loggedIn: false });
    }

    _login = () => {
        this.setState({loggedIn: true});
    };

    render() {
        return (
            <ScrollView style={ layout.paddlessContainer }>

                <View style={ layout.columnSeparator }>
                    { (!this.state.loggedIn ?
                        <View style={ layout.paddedColumn50 }>
                            <TouchableOpacity
                                style={ cards.card }
                                onPress={() => { this.props.navigation.navigate("Login") }}>
                                <Image
                                    style={ image.icon }
                                    source={require('../res/icons/login.png')}
                                 />
                                <Text style={ text.centerDullBlack }>Log In</Text>
                            </TouchableOpacity>
                        </View>:
                        <View style={ layout.paddedColumn50 } >
                            <TouchableOpacity
                                style={ cards.card }
                                onPress={() => { this._logout() }}>
                                <Image
                                    style={ image.icon }
                                    source={require('../res/icons/logout.png')}
                                />
                                <Text style={ text.centerDullBlack }>Log Out</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    <View style={ layout.paddedColumn50 } >
                        <TouchableOpacity 
                            style={ cards.card } 
                            onPress={ () => { this.props.navigation.navigate('ChooseAccount') } }>
                            <Image
                                style={ image.icon }
                                source={require('../res/icons/create_account.png')}
                            />
                            <Text style={ text.centerDullBlack }>Create Account</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={ layout.columnSeparator }>
                    <View style={ layout.paddedColumn50 } >
                        <TouchableOpacity 
                            style={ cards.card }
                            onPress={ () => { this.props.navigation.navigate('Profile') } }>
                            <Image
                                style={ image.icon }
                                source={require('../res/icons/profile.png')}
                            />
                            <Text style={ text.centerDullBlack }>Profile</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={ layout.paddedColumn50 } >
                        <TouchableOpacity 
                            style={ cards.card } 
                            onPress={ () => { this.props.navigation.navigate('Clubs') } }>
                            <Image
                                style={ image.icon }
                                source={require('../res/icons/match.png')}
                            />
                            <Text style={ text.centerDullBlack }>Clubs</Text>
                        </TouchableOpacity>
                    </View>
                </View>
    
                <View style={ layout.columnSeparator }>
                    <View style={ layout.paddedColumn50 } >
                        <TouchableOpacity
                            style={ cards.card }
                            onPress={ () => { this.props.navigation.navigate('Managers') } } >
                            <Image
                                style={ image.icon }
                                source={require('../res/icons/technical.png')}
                            />
                            <Text style={ text.centerDullBlack }>Managers</Text>
                        </TouchableOpacity>
                    </View >

                    <View style={ layout.paddedColumn50 } >
                        <TouchableOpacity 
                            style={ cards.card } 
                            onPress={ () => { this.props.navigation.navigate('Scouts') } } >
                            <Image
                                style={ image.icon }
                                source={require('../res/icons/technical.png')}
                            />
                            <Text style={ text.centerDullBlack }>Scouts</Text>
                        </TouchableOpacity>
                    </View>
                </View>
    
                <View style={ layout.columnSeparator } >
                    <View style={ layout.paddedColumn50 } >
                        <TouchableOpacity 
                            style={ cards.card } 
                            onPress={ () => { this.props.navigation.navigate('AddPlayer') } }>
                            <Image
                                style={ image.icon }
                                source={require('../res/icons/player.png')}
                            />
                            <Text style={ text.centerDullBlack }>Add Player</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={ layout.paddedColumn50 } >
                        <TouchableOpacity 
                            style={ cards.card } 
                            onPress={ () => { this.props.navigation.navigate('AddStatistics') } }>
                            <Image
                                style={ image.icon }
                                source={require('../res/icons/statistics.png')}
                            />
                            <Text style={ text.centerDullBlack }>Add Stats</Text>
                        </TouchableOpacity>
                    </View>
                </View>
    
                <View style={ layout.columnSeparator }>
                    <View style={ layout.paddedColumn50 } >
                        <TouchableOpacity 
                            style={ cards.card } 
                            onPress={ () => { this.props.navigation.navigate('Feedback') } }>
                            <Image
                                style={ image.icon }
                                source={require('../res/icons/feedback.png')}
                            />
                            <Text style={ text.centerDullBlack }>Feedback</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={ layout.paddedColumn50 } >
                        <TouchableOpacity 
                            style={ cards.card } 
                            onPress={ () => { this.props.navigation.navigate('About') } }>
                        <Image
                            style={ image.icon }
                            source={require('../res/icons/about.png')}
                        />
                            <Text style={ text.centerDullBlack }>About</Text>
                        </TouchableOpacity>
                    </View>
                </View>
    
            </ScrollView>
        );
    }
};

export default More;
