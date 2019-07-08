import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import LoadingIndicator from './LoadingIndicator';


export default class extends Component {
    constructor(props){
        super(props);
        this._checkLogin();
    }

    _checkLogin = async () => {
        try {
            const user = await AsyncStorage.getItem('app_user');
            if(user !== null){
                this.props.navigation.navigate('Main');
            } else {
                this.props.navigation.navigate('Auth')
            }
        } catch(err){
            this.setState({ loggedIn: false, loading: false });
        }
    }
    
    render(){
        return <LoadingIndicator />
    }
}