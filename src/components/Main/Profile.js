import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image, Alert, ToastAndroid,
    PermissionsAndroid, ActivityIndicator } from 'react-native';
import ImagePicker from 'react-native-image-picker';

import LoadingIndicator from '../Helper/LoadingIndicator';
import SomethingWentWrong from '../Helper/SomethingWentWrong';
import AsyncStorage from '@react-native-community/async-storage';
import { send, getHost } from '../../data/fetch';
import layout from '../../res/styles/layout';
import text from '../../res/styles/text';
import image from '../../res/styles/image';
import buttons from '../../res/styles/buttons';


 export default class Partners extends Component {
     constructor(props) {
         super(props);
         this.state = {
             loading: false,
             somethingWrong: false,
             activeIndicator: false,
             user: {},
             newPhoto: null,
             userStatus: '',
         }
     }

     componentWillMount(){
         this.setState({ loading: true, somethingWrong: false })
     }

     componentDidMount() {
         this._fetchProfile();
     }

     _fetchProfile = async  () => {
         const userId = await AsyncStorage.getItem('app_user');
         this._getStatus(userId);
     }

     _getStatus = async (userId) => {
         const userStatus = await AsyncStorage.getItem('status');
         if(userStatus === 'scout'){
            this._loadProfile('/get_scout', userId, userStatus);
         } else {
            this._loadProfile('/get_manager', userId, userStatus);
         }
     }

     _loadProfile = async (url, userId, userStatus) => {
         const formData = new FormData();

         if(userStatus === 'scout'){
            formData.append('scout_id', userId);
         } else {
            formData.append('manager_id', userId);
         }
         
         formData.append('user_status', userStatus);

         await send(url, formData)
            .then(
                response => {
                    if(response.user) {
                        this.setState({ loading: false, somethingWrong: false,
                            user: response.user, userStatus: userStatus,
                        })
                    }else{
                        this.setState({ loading: false, somethingWrong: true });
                    }
                },
                () => this.setState({ loading: false, somethingWrong: true })
            )
            .catch(() => this.setState({ loading: false, somethingWrong: true }))
     }

     _deleteAccount = async () => {
        Alert.alert(
            'Delete Account',
            'Are You Sure You Want To Delete Your Account?',
            [
                {
                    text: 'Cancel',
                    onPress: f => f
                },
                {
                    text: 'OK',
                    onPress: () => this._logoutServer()
                }
            ],
            {
                cancelable: false,
            }
        )
     }

     _logoutServer = async () => {
         this.setState({ loading: false, activeIndicator: true });
         const formData = new FormData();
         formData.append('user_id', this.state.user.id);
         formData.append('user_status', this.state.userStatus);

         await send('/delete_account', formData)
            .then(
                response => {
                    if(response.success){
                        this._logoutLocal();
                    }else{
                        this.setState({ loading: false, somethingWrong: true});
                    }
                },
                () => this.setState({ loading: false, somethingWrong: true})
            )
            .catch(() => this.setState({ loading: false, somethingWrong: true}) )
     }

     _logoutLocal = async () => {
         try{
             await AsyncStorage.clear();
             ToastAndroid.showWithGravity(
                 'Successfully Deleted Account',
                 ToastAndroid.LONG,
                 ToastAndroid.TOP,
             )
             this.props.navigation.navigate('Auth');

         }catch(err){
             this.setState({ loading: false, somethingWrong: true });
         }
     }

     _changePhoto = async () => {
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
                this.setState({ newPhoto: response });
            }
        })
    }

     _updatePhoto = async () => {
         this.setState({ somethingWrong: false, activeIndicator: true });
         const formData = new FormData();
         formData.append('user_id', this.state.user.id);
         formData.append('user_status', this.state.userStatus);
         formData.append('image', {
            uri: this.state.newPhoto.uri,
            type: this.state.newPhoto.type,
            name: this.state.newPhoto.fileName,
         });

         await send('/update_photo', formData)
            .then(
                response => {
                    if(response.user){
                        this.setState({ somethingWrong: false, activeIndicator: false
                        })

                        ToastAndroid.showWithGravity(
                            'Successfully Updated Photo',
                            ToastAndroid.LONG,
                            ToastAndroid.TOP
                        )

                    }else {
                        this.setState({ somethingWrong: true, activeIndicator: false });
                    }
                },
                () => this.setState({ somethingWrong: true, activeIndicator: false })
            )
            .catch(() => this.setState({ somethingWrong: true, activeIndicator: false }) )
     }

     _tryAgain = () => {
        this.setState({ loading: true, somethingWrong: false });
        this._fetchProfile();
    }


     render() {
         const { loading, somethingWrong, activeIndicator, user, userStatus, newPhoto } = this.state;

         if(loading) {
             return (
                 <LoadingIndicator />
             );
         } else if(somethingWrong) {
             return (
                 <SomethingWentWrong tryAgain = { this._tryAgain } />
             );
         } else {
             return (
                 <ScrollView style={ layout.container }>
                     <View style={ layout.columnSeparator }>
                         <View style={ layout.column20 }>
                             <Text style={ text.boldBlack }>NAME</Text>
                         </View>

                         <View style={ layout.column80 }>
                             <Text style={ text.leftPaddedMediumBlack }>
                                 { `${user.first_name} ${user.last_name }`}
                             </Text>
                         </View>
                     </View>

                     <View style={ layout.columnSeparator }>
                         <View style={ layout.column20 }>
                             <Text style={ text.boldBlack }>ROLE</Text>
                         </View>

                         <View style={ layout.column80 }>
                             <Text style={ text.leftPaddedMediumBlack }>
                                 { userStatus }
                             </Text>
                         </View>
                     </View>

                     <View>
                         <Image
                            style={ image.rectPhoto }
                            source={
                                newPhoto?
                                    newPhoto :

                                    { uri: `${getHost.host}/uploads/user_images/${user.image_name}` }
                            }
                         />
                     </View>

                     {
                         newPhoto?

                         !activeIndicator ?
                         <TouchableOpacity
                             style={ buttons.rectArmyGreenButton} 
                             onPress = { () => this._updatePhoto() }
                         >
                             <Text style={ text.autoWhite }>update photo</Text>
                         </TouchableOpacity> :

                         <View style={ buttons.rectArmyGreenButton }>
                             <View style={ layout.column50ArmyGreen}>
                                 <ActivityIndicator
                                     color='white'
                                 />
                             </View>
                         </View> :

                            <TouchableOpacity
                                style={ buttons.rectGreyButton }
                                onPress={ () => this._changePhoto() }
                            >
                                <Text style={ text.autoWhite }>change photo</Text>
                            </TouchableOpacity>


                            

                     }

                     <View style={ layout.columnSeparator }>
                         <View style={ layout.column20 }>
                             <Text style={ text.boldBlack }>EMAIL</Text>
                         </View>

                         <View style={ layout.column80 }>
                             <Text style={ text.leftPaddedMediumBlack }>
                                 { user.email }
                             </Text>
                         </View>
                     </View>
                     
                     {
                         userStatus === 'manager' ?
                            <View>
                                <View style={ layout.columnSeparator }>
                                    <View style={ layout.column20 }>
                                        <Text style={ text.boldBlack }>CLUB</Text>
                                    </View>

                                    <View style={ layout.column80 }>
                                        <Text style={ text.leftPaddedMediumBlack }>
                                            { user.club.name }
                                        </Text>
                                    </View>
                                </View>

                                <View style={ layout.columnSeparator }>
                                    <View style={ layout.column20 }>
                                        <Text style={ text.boldBlack }>LEAGUE</Text>
                                    </View>

                                    <View style={ layout.column80 }>
                                        <Text style={ text.leftPaddedMediumBlack }>
                                            { user.club.league }
                                        </Text>
                                    </View>
                                </View>
                            </View> :

                            null
                     }

                     <TouchableOpacity
                        style={ buttons.rectRedButton }
                        onPress={ () => this._deleteAccount() }
                     >
                         <Text style={ text.autoWhite }>delete account</Text>
                     </TouchableOpacity>

                     <View style={ layout.padBottom }></View>
                     
                 </ScrollView>
             )
         }
     }
 }