import React, { Component } from 'react';
import { ScrollView, Text, View, TextInput, TouchableOpacity, Picker,
    PermissionsAndroid, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import SomethingWentWrong from '../SomethingWentWrong';
import layout from '../../res/styles/layout';
import text from '../../res/styles/text';
import input from '../../res/styles/input';
import buttons from '../../res/styles/buttons';
import { send } from '../../data/fetch';
import LoadingIndicator from '../LoadingIndicator';


export default class extends Component{
    constructor(props){
        super(props);
        this.state = {
            somethingWrong: false,
            loadingIndicator: false,
            promptLogin: false,

            club: '',

            firstName: "",
            lastName: "",
            role: "",
            photo: null,
            year: 1950,
            month: 1,
            date: 1,

            nullFirstName: false,
            nullLastName: false,
            nullRole: false,
            nullPhoto: false,
            nullYear: false,
            nullMonth: false,
            nullDate: false,

            submitState: false,
        }
    }

    componentWillMount() {
        this.setState({ loading: true });
    }

    componentDidMount(){
        this._fetchClubs();
    }

    _fetchClubs = async () => {
        const user = await AsyncStorage.getItem('user');
        if(user){
            // Get His Club
            const formData = new FormData();
            formData.append('manager', user);

            send('/get_club_by_manager', formData)
                .then(
                    response => {
                        if(response.club){
                            this.setState({ loading: false, somethingWrong: false, club: response.club});
                        } else {
                            alert(response.fail)
                            this.setState({ loading: false, somethingWrong: true });
                        }
                    }
                )

        } else {
            // Prompt login
            this.setState({ loading: false, somethingWrong: false, promptLogin: true });
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
                alert('permissions granted');
            } else {
                // Do nothing
            }
        }catch(error){
            // do nothing
        }
    }

    _submit = () => {}

    _tryAgain = () => {}

    _years = () => {
        const _years = [];
        for(var i = 1950; i <= 2010; i++){
            _years.push(i)
        }
        return _years;
    }

    _dates = () => {
        const _dates = [];
        for(var i = 1; i <= 31; i++){
            _dates.push(i)
        }
        return _dates;
    }

    render(){
        const { somethingWrong, promptLogin, loading, club } = this.state;
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
        } else if(promptLogin) {
            return (
                <PromptLogin />
            )
        }else {
            return (
                <ScrollView style={ layout.container } >

                    <Text style={ text.centerHeadingArmGreen } >{ club.name }</Text>

                    <Text style={ input.label } >FIRST NAME</Text>
                    {
                       !this.state.submitState ?
                           null:
                           this.state.firstName ?
                               null :
                               <Text style={ inputStyles.redLabel } >this field is required</Text>
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
                               <Text style={ inputStyles.redLabel } >this field is required</Text>
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
                               <Text style={ inputStyles.redLabel } >this field is required</Text>
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
                                <Image source={ this.state.photo } />
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
                        this.state.loggingIndicator ?
                            <View style={ createStyles.loader } >
                                <View style={ createStyles.creatingTextContainer } >
                                    <Text style={ createStyles.creatingText } >logging in</Text>
                                </View>
                                <View>
                                    <ActivityIndicator
                                        color='#fff'
                                        style={ createStyles.indicator }
                                    />
                                </View>
                            </View> :

                            <TouchableOpacity
                                style={ buttons.rectArmyGreenButton }
                                onPress={ () => this._submit() }
                            >
                                <Text  style={ text.autoWhite } >Submit</Text>
                            </TouchableOpacity>
                    }

                    <View style={ layout.padBottom }></View>

                </ScrollView>
            );
        }
    }

}
