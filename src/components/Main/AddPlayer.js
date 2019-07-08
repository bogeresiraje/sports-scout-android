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
import { send } from '../../data/fetch';


import image from '../../res/styles/image';


export default class extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            somethingWrong: false,
            activeIndicator: false,

            club: '',

            firstName: "",
            lastName: "",
            role: "",
            photo: null,
            year: 1950,
            month: 1,
            date: 1,

            submitState: false,
        };
    }

    componentWillMount() {
        this.setState({ loading: true });
    }

    componentDidMount(){
        this._fetchClub();
    }

    _fetchClub = async () => {
        const user_id = await AsyncStorage.getItem('app_user');
        if(user_id){
            // Get His Club
            const formData = new FormData();
            formData.append('manager_id', user_id);

            send('/get_club_by_manager', formData)
                .then(
                    response => {
                        if(response.club){
                            this.setState({ loading: false, somethingWrong: false, club: response.club});
                        } else {
                            this.setState({ loading: false, somethingWrong: true });
                        }
                    },
                    () => this.setState({ loading: false, somethingWrong: true })
                )

        } else {
            // Prompt login
            this.props.navigation.navigate('Auth');
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

    _submit = () => {
        this.setState({ submitState: true, activeIndicator: false });
        const { firstName, lastName, role, photo, year, month, date, club } = this.state;
        if(photo && firstName && lastName && role && year && month && date && club ){
                this.setState({ activeIndicator: true });
                const formData = new FormData()
                formData.append('first_name', firstName);
                formData.append('last_name', lastName);
                formData.append('role', role);
                formData.append('year', year);
                formData.append('month', month);
                formData.append('date', date);
                formData.append('club_name', club.name);

                formData.append('photo', {
                    uri: photo.uri,
                    type: photo.type,
                    name: photo.fileName,
                })

                send('/add_player', formData)
                    .then(
                        response => {
                            if(response.success){
                                this.setState({ submitState: true, activeIndicator: false });
                                this.props.navigation.navigate('PlayerProfile',
                                    {
                                        'playerId': response.player_id,
                                        'toastMessage': 'Successfully Added New Player',
                                    }
                                );
                            }else if(response.fail){
                            }
                        },
                        () => {
                            this.setState({ submitState: true, activeIndicator: false, somethingWrong: true });
                        }
                    )
                    .catch(() => this.setState({ activeIndicator: false, submitState: false, submitState: true }));
            } else {
                this.setState({ activeIndicator: false });
            }
    }

    _tryAgain = () => {
        this.setState({ somethingWrong: false, activeIndicator: false, loading: true });
        this._fetchClub();
    }

    _years = () => {
        const _years = [];
        for(var i = 1950; i <= 2010; i++){
            _years.push(i);
        }
        return _years;
    }

    _dates = () => {
        const _dates = [];
        for(var i = 1; i <= 31; i++){
            _dates.push(i);
        }
        return _dates;
    }

    render(){
        const { somethingWrong, loading, club, activeIndicator } = this.state;
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dates = this._dates();
        const years = this._years();
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

                    <Text style={ text.centerHeadingArmyGreen } >{ club.name }</Text>

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

                    {
                        this.state.photo ?
                            <View>
                                <Image
                                    style={ image.rectPhoto }
                                    source={ this.state.photo }
                                />
                            </View> :

                            null
                    }

                    <TouchableOpacity
                        style={ buttons.rectGreyButton }
                        onPress={ () => this._uploadPhoto() }
                    >
                        <Text  style={ text.autoWhite } >Upload Photo</Text>
                    </TouchableOpacity>

                    <Text style={ input.label } >DATE OF BIRTH</Text>

                    <View style={ layout.columnSeparator }>
                        <View style={ layout.column50Justify } >
                            <Text style={ text.autoBlack } >year</Text>
                        </View>

                        <View style={ layout.borderColumn50 } >
                            <Picker
                                selectedValue={ this.state.year }
                                style={input.inputPicker }
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({year: itemValue})
                                }
                            >
                            {
                                years.map((year, index) =>
                                    <Picker.Item key={ index } label={ `${year}` } value={ year } />
                                )
                            }
                            </Picker>
                        </View>
                    </View>

                    <View style={ layout.columnSeparator } >
                            <View style={ layout.column50Justify } >
                                <Text style={ text.autoBlack } >month</Text>
                            </View>

                            <View style={ layout.borderColumn50 } >
                                <Picker
                                    selectedValue={ this.state.month }
                                    style={ input.inputPicker }
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({month: itemValue})
                                    }
                                >
                                {
                                    months.map((month, index) =>
                                        <Picker.Item key={ index } label={ month } value={ index + 1 } />
                                    )
                                }
                                </Picker>
                            </View>
                    </View>

                    <View style={ layout.columnSeparator }>
                        <View style={ layout.column50Justify }>
                            <Text style={ text.autoBlack }>date</Text>
                        </View>

                        <View style={ layout.borderColumn50 } >
                            <Picker
                                selectedValue={ this.state.date }
                                style={ input.inputPicker }
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({date: itemValue})
                                }
                            >
                            {
                                dates.map((date, index) =>
                                    <Picker.Item key={ index } label={ `${date}` } value={ date } />
                                )
                            }
                            </Picker>
                        </View>
                    </View>

                    {
                        !activeIndicator ?
                         <TouchableOpacity
                             style={ buttons.rectArmyGreenButton} 
                             onPress = { () => this._submit() }
                         >
                             <Text style={ text.autoWhite }>submit</Text>
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
