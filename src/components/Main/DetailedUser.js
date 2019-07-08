import React, { Component } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Image } from 'react-native';
import LoadingIndicator from '../Helper/LoadingIndicator';
import SomethingWentWrong from '../Helper/SomethingWentWrong';
import layout from '../../res/styles/layout';
import text from '../../res/styles/text';
import image from '../../res/styles/image';
import { getHost, send } from '../../data/fetch';
import buttons from '../../res/styles/buttons';


export default class extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            somethingWrong: false,
            user: {},
            status: '',
        };
    }

    componentWillMount(){
        this.setState({ loading: true, somethingWrong: false,
            status: this.props.navigation.getParam('userStatus') });
    }

    componentDidMount(){
        this._fetchUser();
    }

    _fetchUser = async () => {
        userId = this.props.navigation.getParam('userId');
        userStatus = this.props.navigation.getParam('userStatus');
        const formData = new FormData();
        let url;
        if(userStatus === 'manager'){
            formData.append('manager_id', userId);
            url = '/get_manager'
        }else {
            formData.append('scout_id', userId);
            url = '/get_scout'
        }

        await send(url, formData)
            .then(
                response => {
                    if(response.user){
                        this.setState({ user: response.user, somethingWrong: false, loading: false,
                        status: userStatus});
                    }else {
                        this.setState({ somethingWrong: true, loading: false });
                    }
                },
                () => this.setState({ somethingWrong: true, loading: false })
            )
            .catch(() => this.setState({ somethingWrong: true, loading: false }))
    }

    _tryAgain = () => {
        this.setState({ loading: true, somethingWrong: false });
        this._fetchUser();
    }

    _toMessages = () => {
        const userId = this.state.user.id;
        const userName = `${this.state.user.first_name} ${this.state.user.last_name}`;
        this.props.navigation.navigate('Messages', {userId: userId, userName: userName,
        userStatus: this.state.status});
    }

    render(){
        const{ loading, somethingWrong, user, status } = this.state;

        if(loading){ return <LoadingIndicator /> }

        else if(somethingWrong){ return <SomethingWentWrong tryAgain={ this._tryAgain } /> }

        else {
            return (
                <ScrollView style={ layout.paddlessContainer }>
                    <View style={ layout.container }>
                        <Text style={ text.centerHeadingArmyGreen }>{ user.username }</Text>

                        <Image
                            style={ image.rectPhoto }
                            source={ {uri: `${getHost.host}/uploads/user_images/${user.image_name }`}}
                        />

                        {
                            status === 'manager' ?
                                <View>
                                    <Text style={ text.mediumBlack }>{ user.club.name }</Text>
                                    <Text style={ text.mediumBlack }>{ user.club.league }</Text>
                                </View> :

                                null
                        }

                        <TouchableOpacity
                            style={ buttons.autoBlueButton }
                            onPress={ () => this._toMessages() }
                        >
                            <Text style={ text.autoWhite }>send message</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            )
        }
    }
}
