import React, { Component } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator, AsyncStorage } from 'react-native';
import LoadingIndicator from './LoadingIndicator';
import SomethingWentWrong from './SomethingWentWrong';
import inputStyles from '../res/styles/input';
import createStyles from '../res/styles/createAccount';
import { send } from '../data/fetch';
import LoginPrompt from './moreComponents/LoginPrompt';


export default class PostView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view: "",
            loading: true,
            submitState: false,
            loggedIn: true,
            somethingWrong: false,
            postingIndicator: false,
        }
    }

    componentDidMount() {
        this.setState({ loading: false });
    }

    tryAgain = () => {
        this.handleSubmit();
    }

    login = () => {
        this.setState({ loggedIn: true });
    }

    handleSubmit = () => {
        this.setState({ postingIndicator: true });
        this.setState({ submitState: true });
        if(this.state.view) {
            this.simplePost();
        } else {
            this.setState({ postingIndicator: false })
        }
    }

    promptLogin = () => {
        this.props.navigation.navigate('Login', {login: this.login});
    }

    simplePost = async () => {
        const { view } = this.state;
        const formData = new FormData();
        await AsyncStorage.getItem('user', (error, response) => {
            let result = JSON.parse(response);
            if(result) {
                formData.append('user_id', result.id);
                    formData.append('body', view);
                    send('/post_view', formData)
                        .then(
                            response => {
                                let view = response.view;
                                if(view.id) {
                                    const { updateViews } = this.props.navigation.getParam('updateViews');
                                    updateViews(view);
                                    this.props.navigation.navigate('ViewsScreen');         
                                } else {
                                    this.setState({ postingIndicator: false, submitState: false, somethingWrong: true});
                                }
                            },
                             () => { this.setState({ postingIndicator: false, submitState: false, somethingWrong: true}); }
                        )
                        .catch(() => {
                            this.setState({ postingIndicator: false, submitState: false, somethingWrong: true});
                        })
            }else {
                this.setState({ loggedIn: false });
            }
        })
    }

    render() {
        const { loading, somethingWrong } = this.state;
        if(loading) {
            return (
                <LoadingIndicator />
            );
        } else if(!this.state.loggedIn) {
            return (
                <LoginPrompt login={ this.promptLogin } />
            )
        } else if(somethingWrong) {
            return (
                <SomethingWentWrong tryAgain={ this.tryAgain } />
            );
        } else {
            return (
                <ScrollView style={ inputStyles.container }>
                    <Text style={ inputStyles.inputLabel } >Enter Your View</Text>
                    {
                       !this.state.submitState ?
                           null:
                           this.state.view ?
                               null :
                               <Text style={ inputStyles.redLabel } >this field is required</Text>
                    }
                    <TextInput
                        style={ inputStyles.inputTextArea }
                        multiline={ true }
                        value = { this.state.view }
                        onChangeText = { text => this.setState({ wrongCredentials: false, view: text })}
                    />

                    {
                        this.state.postingIndicator ?
                            <View style={ createStyles.loader } >
                                <View style={ createStyles.creatingTextContainer } >
                                    <Text style={ createStyles.creatingText } >posting</Text>
                                </View>
                                <View>
                                    <ActivityIndicator
                                        color='#fff'
                                        style={ createStyles.indicator }
                                    />
                                </View>
                            </View> :

                            <TouchableOpacity
                                style={ inputStyles.inputSendButton }
                                onPress={ () => { this.handleSubmit() } }
                            >
                                <Text  style={ inputStyles.inputSendText } >post</Text>
                            </TouchableOpacity>
                    }

                    
                </ScrollView>
            )
        }
    }
}
