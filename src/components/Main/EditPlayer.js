import React, { Component } from 'react';
import { ScrollView, Text, View, TextInput, TouchableOpacity, Picker,
    PermissionsAndroid, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';

import LoadingIndicator from '../Helper/LoadingIndicator';
import SomethingWentWrong from '../Helper/SomethingWentWrong';
import layout from '../../res/styles/layout';
import text from '../../res/styles/text';
import input from '../../res/styles/input';
import buttons from '../../res/styles/buttons';
import { send, getHost } from '../../data/fetch';


import image from '../../res/styles/image';


export default class extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            somethingWrong: false,
            activeIndicator: false,

            playerId: 0,
            firstName: "",
            lastName: "",
            role: "",
            photo: null,
            photo_name: '',

            submitState: false,
        };
    }

    componentWillMount() {
        this.setState({ loading: true });
    }

    componentDidMount(){
        this._fetchPlayer();
    }

    _fetchPlayer = async () => {
        const playerId = this.props.navigation.getParam('playerId');
        if(playerId){
            // Get This Player
            const formData = new FormData();
            formData.append('player_id', playerId);

            send('/get_player', formData)
                .then(
                    response => {
                        if(response.player){
                            this.setState({ loading: false, somethingWrong: false,
                                firstName: response.player.first_name,
                                lastName: response.player.last_name,
                                photo_name: response.player.photo_name,
                                role: response.player.role
                            });
                        } else {
                            this.setState({ loading: false, somethingWrong: true });
                        }
                    },
                    () => this.setState({ loading: false, somethingWrong: true })
                )

        } else {
            // Error
            this.setState({ loading: false, somethingWrong: true })
        }
    }

    _uploadPhoto = async () => {
        try {
            const granted = await PermissionsAndroid.requestMultiple(
                [
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                ]
            );
            if(granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
                && granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED ){
                this._upload();
            } else {
                // Do nothing
            }
        }catch(error){
            // do nothing
        }
    }

    _upload = () => {
        ImagePicker.showImagePicker(response => {
            if(response.didCancel){
                // Do nothing
            } else if(response.error){
                // Do nothing
            } else {
                this.setState({ photo: response });
            }
        })
    }

    _update = () => {
        this.setState({ submitState: true, activeIndicator: false });
        const { playerId, firstName, lastName, role, photo } = this.state;
        if(firstName && lastName && role ){
                this.setState({ activeIndicator: true });
                const formData = new FormData();
                formData.append('player_id', this.props.navigation.getParam('playerId') )
                formData.append('first_name', firstName);
                formData.append('last_name', lastName);
                formData.append('role', role);

                if(photo){
                    formData.append('photo', {
                        uri: photo.uri,
                        type: photo.type,
                        name: photo.fileName,
                    })

                    this._sendToServer('/update_player_with_photo', formData);

                }else{
                    this._sendToServer('/update_player', formData);
                }

                
            } else {
                this.setState({ activeIndicator: false });
            }
    }

    _sendToServer = async (url, formData) => {
        await send(url, formData)
        .then(
            response => {
                if(response.player_id){
                    this.setState({ submitState: false, activeIndicator: false });
                    this.props.navigation.navigate('PlayerProfile',
                        {
                            'playerId': response.player_id,
                            'toastMessage': 'Successfully Updated Player',
                        }
                    );
                }else{
                    this.setState({ submitState:false, somethingWrong: true, activeIndicator: false })
                }
            },
            () => {
                this.setState({ submitState: true, activeIndicator: false, somethingWrong: true });
            }
        )
        .catch(() => this.setState({ activeIndicator: false, submitState: false, submitState: true }));
    }


    _tryAgain = () => {
        this.setState({ somethingWrong: false, activeIndicator: false, loading: true });
        this._fetchPlayer();
    }

    render(){
        const { somethingWrong, loading, photo, role, photo_name, activeIndicator } = this.state;

        if(loading){
            return (
                <LoadingIndicator />
            )
        } else if(somethingWrong){
            return (
                <SomethingWentWrong tryAgain={ this._tryAgain } />
            );
        }else {
            return (
                <ScrollView style={ layout.container } >

                    <Text style={ input.label } >FIRST NAME</Text>
                    {
                       !this.state.submitState ?
                           null:
                           this.state.firstName ?
                               null :
                               <Text style={ text.autoRed } >this field is required</Text>
                    }
                    <TextInput
                        style={ input.inputText }
                        value = { this.state.firstName }
                        autoCapitalize='words'
                        onChangeText = { first => this.setState({ wrongCredentials: false, firstName: first })}
                    />

                    <Text style={ input.label } >LAST NAME</Text>
                    {
                       !this.state.submitState ?
                           null:
                           this.state.lastName ?
                               null :
                               <Text style={ text.autoRed } >this field is required</Text>
                    }
                    <TextInput
                        style={ input.inputText }
                        value = { this.state.lastName }
                        autoCapitalize='words'
                        onChangeText = { last => this.setState({ wrongCredentials: false, lastName: last })}
                    />
   
                    <Text style={ input.label } >ROLE</Text>
                    {
                       !this.state.submitState ?
                           null:
                           this.state.role ?
                               null :
                               <Text style={ text.autoRed } >this field is required</Text>
                    }
                    <TextInput
                        style={ input.inputText }
                        autoCapitalize='words'
                        value = { this.state.role }
                        onChangeText = { role => this.setState({ wrongCredentials: false, role: role })}
                    />

                    <Image
                        style={ image.rectPhoto }
                        source={ 
                            photo?
                                photo:

                                { uri: `${getHost.host}/uploads/player_images/${photo_name}` }
                         }
                    />

                    <TouchableOpacity
                        style={ buttons.rectGreyButton }
                        onPress={ () => this._uploadPhoto() }
                    >
                        <Text  style={ text.autoWhite } >change photo</Text>
                    </TouchableOpacity>

                    {
                        !activeIndicator ?
                         <TouchableOpacity
                             style={ buttons.rectArmyGreenButton} 
                             onPress = { () => this._update() }
                         >
                             <Text style={ text.autoWhite }>update</Text>
                         </TouchableOpacity> :

                         <View style={ buttons.rectArmyGreenButton }>
                             <View style={ layout.column50ArmyGreen}>
                                 <ActivityIndicator
                                     color='white'
                                 />
                             </View>
                         </View>
                    }

                    <View style={ layout.padBottom }></View>

                </ScrollView>
            );
        }
    }

}
