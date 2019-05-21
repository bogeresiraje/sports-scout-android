import React, { Component } from 'react';
import { ScrollView, TextInput, Text, TouchableOpacity, View, ActivityIndicator,
    ToastAndroid } from 'react-native';
import LoadingIndicator from '../LoadingIndicator';
import inputStyles from '../../res/styles/input';
import { send } from '../../data/fetch';


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
            send('/verify_code', formData)
                .then(
                    response => {
                        const returnCode = response.code;
                        if(returnCode === 1){
                            // Everything went well, and code submited was verified OK
                            ToastAndroid.showWithGravity(
                                'Your Account Has Been Successfully Created',
                                ToastAndroid.SHORT,
                                ToastAndroid.BOTTOM,
                            );
                            this.props.navigation.navigate("Home");
                        }else if(returnCode === 0){
                            // verification code could have been expired
                            this.setState({ submitState: false });
                            ToastAndroid.showWithGravity(
                                'Your Code Has Expired',
                                ToastAndroid.LONG,
                                ToastAndroid.BOTTOM,
                            );
                        }else if(returnCode === -1){
                            // verification code supplied is wrong
                            this.setState({ submitState: false });
                            ToastAndroid.showWithGravity(
                                'Your Verifiction Code is Wrong',
                                ToastAndroid.LONG,
                                ToastAndroid.BOTTOM,
                            );
                        }
                    }
                )

        } else {
            this.setState({ nullInput: true });
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
                <ScrollView style={ inputStyles.container } >
                    {
                        this.state.loading ?
                            <LoadingIndicator /> :
                            <View>
                                
                                <View style={ inputStyles.headerLabel }>
                                <Text style={ inputStyles.inputLabel } >Enter the numeric code that has been sent to your email in the box below</Text>
                                {
                                    this.state.wrongCode ?
                                        <Text>wrong code has been entered</Text> :
                                        null
                                }
                                {
                                    this.state.expiredCode ?
                                        <View>
                                            <Text>your code has expired</Text>
                                            <TouchableOpacity
                                                onPress={ () => { this.requestCode() } }
                                            >
                                                <Text style={ inputStyles.touchableText }>send code again</Text>
                                            </TouchableOpacity>
                                        </View> :
                                        null
    
                                }
                                {
                                    this.state.submitState ?
                                        this.state.nullInput ?
                                            <Text style={ inputStyles.redLabel } >code is required</Text>:
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
                                        <View style={ inputStyles.loader } >
                                            <View style={ inputStyles.creatingTextContainer } >
                                                <Text style={ inputStyles.creatingText } >submitting</Text>
                                            </View>
                                            <View>
                                                <ActivityIndicator
                                                    color='#fff'
                                                    style={ inputStyles.indicator }
                                                />
                                            </View>
                                        </View> :
    
                                        <TouchableOpacity
                                            style={ inputStyles.inputSendButton }
                                            onPress={ () => { this._submitCode() } }
                                        >
                                            <Text  style={ inputStyles.inputSendText } >Submit</Text>
                                        </TouchableOpacity>
                                }
                                
                                <View style={ inputStyles.footerLabel }>
                                    <Text style={ inputStyles.inputLabel } >Didn't receive any code?</Text>
                                    <TouchableOpacity
                                        onPress={ () => { this.requestCode() } }
                                    >
                                        <Text style={ inputStyles.touchableText }>send code again</Text>
                                    </TouchableOpacity>
                                </View>
    
                            </View>
                    }
                </ScrollView>
            );
        }
    }
}
