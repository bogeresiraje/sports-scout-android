import React, { Component } from 'react';
import { ScrollView, TextInput, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import LoadingIndicator from '../Helper/LoadingIndicator';
import input from '../../res/styles/input';
import buttons from '../../res/styles/buttons';
import { send } from '../../data/fetch';
import layout from '../../res/styles/layout';
import text from '../../res/styles/text';


export default class ConfirmAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            code: "",
            wrongCode: false,
            expiredCode: false,
            submitState: false,
            nullInput: false,
            submittingCodeIndicator: false,
            somethingWrong: false,
        }
    }

    componentDidMount() {
        this.setState({ loading: false });
    }

    _submitCode = () => {
        this.setState({ submitState: true });
        if( this.state.code ){
            this.setState({ submittingCodeIndicator: true})

            const formData = new FormData();
            formData.append('code', this.state.code);
            send('/verify_manager_code', formData)
                .then(
                    response => {
                        const returnCode = response.code;
                        if(returnCode === 1){
                            // Everything went well, and code submited was verified OK
                            this._saveCredentials(response.user_id, 'scout')
                        }else if(returnCode === 0){
                            // verification code could have been expired
                            this.setState({ submitState: false, submittingCodeIndicator: false,
                            wrongCode: true, submitState: false });
                        }else if(returnCode === -1){
                            // verification code supplied is wrong
                            this.setState({ submitState: false, submittingCodeIndicator: false,
                            submitState: false, expiredCode: true });
                        }
                    },
                    () => this.setState({ loading: false, somethingWrong: true, submittingCodeIndicator: false })
                )
                .catch(() => this.setState({ loading: false, somethingWrong: true, submittingCodeIndicator: false }))

        } else {
            this.setState({ nullInput: true });
        }
           
    }

    _saveCredentials = async (username, status) => {
        try {
            await AsyncStorage.setItem('app_user', username);
            await AsyncStorage.setItem('status', status);
            this.props.navigation.navigate('Main');
        }catch(err){
            //
        }
    }

    _requestNewCode = () => {
        // to be implemented
    }

    _tryAgain = () => {}

    render() {
        if(this.state.somethingWrong){
            return (
                <SomethingWentWrong tryAgain={ this._tryAgain } />
            );
        }else {
            return (
                <ScrollView style={ layout.paddlessContainer } >
                    {
                        this.state.loading ?
                            <LoadingIndicator /> :
                            <View style={ layout.justifyMaxGrey }>
                                
                                <View >
                                <Text style={ input.label } >Enter the numeric code that has been sent to your email in the box below</Text>
                                {
                                    this.state.wrongCode ?
                                        <Text style={ text.autoRed }>wrong code has been entered</Text> :
                                        null
                                }
                                {
                                    this.state.expiredCode ?
                                        <View>
                                            <Text style={ text.autoRed }>your code has expired</Text>
                                            <TouchableOpacity
                                                onPress={ () => { this._requestNewCode() } }
                                            >
                                            </TouchableOpacity>
                                        </View> :
                                        null
    
                                }
                                {
                                    this.state.submitState ?
                                        this.state.nullInput ?
                                            <Text style={ text.autoRed } >code is required</Text>:
                                            null:
                                        null
                                }
                                </View>
    
                                <TextInput
                                    style={ inputStyles.inputText }
                                    value={ this.state.code }
                                    onChangeText={ code => { this.setState({ code }) } }
                                />
                                
                                {
                                    this.state.submittingCodeIndicator ?
                                        <View style={ buttons.autoArmyGreenButton } >
                                            <ActivityIndicator
                                                color='#fff'
                                            />
                                        </View> :
    
                                        <TouchableOpacity
                                            style={ buttons.rectArmyGreenButton }
                                            onPress={ () => { this._submitCode() } }
                                        >
                                            <Text  style={ text.autoWhite } >Submit</Text>
                                        </TouchableOpacity>
                                }
                                
                                <View style={ input.footerLabel }>
                                    <Text style={ input.label } >Didn't receive any code?</Text>
                                    <TouchableOpacity
                                        onPress={ () => { this._requestNewCode() } }
                                    >
                                        <Text style={ text.autoBlue }>send code again</Text>
                                    </TouchableOpacity>
                                </View>
    
                            </View>
                    }
                </ScrollView>
            );
        }
    }
}
