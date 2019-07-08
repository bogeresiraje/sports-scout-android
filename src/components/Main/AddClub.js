import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Text, TextInput, PermissionsAndroid, Image } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import LoadingIndicator from '../Helper/LoadingIndicator';
import SomethingWentWrong from '../Helper/SomethingWentWrong';
import layout from '../../res/styles/layout';
import { getHost, send } from '../../data/fetch';
import input from '../../res/styles/input';
import text from '../../res/styles/text';
import cards from '../../res/styles/cards';
import image from '../../res/styles/image';
import buttons from '../../res/styles/buttons';


export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            somethingWrong: false,
            bufferIndicator: false,
            name: '',
            logo: null,
            avatar: null,
            league: '',

            submitState: false,
            wrongCredentials: false,
        };
    }

    componentWillMount() {
        this.setState({ loading: true });
    }

    componentDidMount() {
        this._fetchAvatar();
    }

    _tryAgain = () => {
        this.setState({ loading: true, somethingWrong: false });
        this._fetchAvatar();
    };

    _fetchAvatar = async () => {
        // Call Promise to load club logo avatar
        await this._load()
            .then(
                response => this.setState({ loading: false, somethingWrong: false, avatar: response }),
                () => this.setState({ loading: false, somethingWrong: true })
            )
            .catch(() => this.setState({ loading: false, somethingWrong: true }))
    }

    _load = () => {
        // Use Promise to fetch avatar
        return new Promise((resolve, reject) => {
            const avatarSource = { uri: `${getHost.host}/uploads/club_logos/avatar.jpg`};
            if(avatarSource === null) {
                return reject();
            } else {
                return resolve(avatarSource);
            }
        })
    }

    _changeLogo = async () => {
        try {
            const granted = await PermissionsAndroid.requestMultiple(
                [
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                ]
            );
            if(granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
                && granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
                && granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED ){
                // Upload photo
                this._uploadPhoto();
            } else {
                // Do nothing
            }
        } catch(error) {
            // Do nothings
        }
    }

    _uploadPhoto = () => {
        ImagePicker.showImagePicker(response => {
            if(response.didCancel){
                // Do nothing
            } else if(response.error){
                // Do nothing
            } else {
                this.setState({ logo: response })
            }
        })
    };

    _submitClub = () => {
        this.setState({ submitState: true, bufferIndicator: true });
        if(this.state.name && this.state.league && this.state.logo){
            const formData = new FormData();
            formData.append('name', this.state.name);
            formData.append('league', this.state.league);

            try{
                formData.append('logo', {
                    uri: this.state.logo.uri  ,
                    type: this.state.logo.type,
                    name: this.state.logo.fileName
                });

                send('/add_club', formData)
                    .then(
                        response => {
                            if(response.success){
                                this.setState({ bufferIndicator: false, somethingWrong: false, submitState: false});
                                this.props.navigation.navigate('ClubOutlay',
                                { 'clubId': response.club_id, toastMessage: 'Successfully Added New Club' });
                            } else {
                                this.setState({ bufferIndicator: false, somethingWrong: true, submitState: false });
                            }
                        },
                        () => {
                            this.setState({ bufferIndicator: false, somethingWrong: true, submitState: false})
                        }
                    )
                    .catch(() => {
                        this.setState({ bufferIndicator: false, somethingWrong: true, submitState: false });
                    } )
            }catch(error){
                //Do nothing
                this.setState({ submitState: false, bufferIndicator: false })
            }
        } else {
            this.setState({ submitState: false, bufferIndicator: false })
        }
    }

    render() {
        const { loading, somethingWrong, avatar, submitState, name, league, bufferIndicator, logo } = this.state;

        if(loading) {
            return (
                <LoadingIndicator />
            )
        } else if(somethingWrong) {
            return (
               < SomethingWentWrong tryAgain={ this._tryAgain } />
            )
        } else {
            return (
                <ScrollView style={ layout.container }>
                    <View>
                        <Text style={ input.label } >CLUB NAME</Text>
                        {
                            !submitState ?
                                null:
                                name ?
                                    null :
                                    <Text style={ text.autoRed } >this field is required</Text>
                        }
                        <TextInput
                            style={ input.inputText }
                            value = { name }
                            autoCapitalize='words'
                            onChangeText = { name => this.setState({ wrongCredentials: false, name: name })}
                        />
                    </View>

                    <View>
                        <Image
                            style={ image.rectPhoto}
                            source={ logo? logo: { uri: avatar.uri } }
                        />

                        <TouchableOpacity
                            style={ buttons.rectGreyButton }
                            onPress={ () => this._changeLogo() }
                        >
                            <Text style={ text.autoWhite }>change logo</Text>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <Text style={ input.label } >LEAGUE</Text>
                        {
                            !submitState ?
                                null:
                                league ?
                                    null :
                                    <Text style={ text.autoRed } >this field is required</Text>
                        }
                        <TextInput
                            style={ input.inputText }
                            value = { league }
                            autoCapitalize='words'
                            onChangeText = { league => this.setState({ wrongCredentials: false, league: league })}
                        />
                    </View>

                    <View>
                        <TouchableOpacity
                            style={ buttons.rectArmyGreenButton }
                            onPress={ (f) => submitState? f: this._submitClub() }
                        >
                            {
                                bufferIndicator && submitState ?
                                    <View style={ layout.columnSeparator }>
                                        <View style={ layout.armyGreenPaddlessContainer }>
                                            <Text style={ text.autoWhite }>submitting</Text>
                                        </View>
                                    </View>:

                                    <Text style={ text.autoWhite } >submit</Text>
                                    
                            }
                        </TouchableOpacity>
                    </View>

                    <View style={ layout.padBottom } ></View>

                </ScrollView>
            )
        }
    }
}
