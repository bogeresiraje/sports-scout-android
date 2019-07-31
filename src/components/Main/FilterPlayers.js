import React, { Component } from 'react';
import { ScrollView, TouchableOpacity, View, Text, Image } from 'react-native';
import text from '../../res/styles/text';
import image from '../../res/styles/image';
import layout from '../../res/styles/layout';
import buttons from '../../res/styles/buttons';


export class FilterPlayers extends Component {
    render() {
        return (
            <ScrollView style={ layout.container }>
                <TouchableOpacity
                        style={ buttons.rectLightGreyButton }
                        onPress={ () => this.props.navigation.navigate('GoalKeepers') }
                    >
                        <View style={ layout.columnSeparatorGrey }>
                            <View style={ layout.column20Grey }>
                                <Image
                                    style={ image.icon }
                                    source={require('../../res/icons/player.png')}
                                />
                            </View>
    
                            <View style={ layout.column80Grey } >
                                <Text style={ text.leftPaddedMediumBlack }>Goal Keepers</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={ buttons.rectLightGreyButton }
                        onPress={ () => this.props.navigation.navigate('Defenders') }
                    >
                        <View style={ layout.columnSeparatorGrey }>
                            <View style={ layout.column20Grey }>
                                <Image
                                    style={ image.icon }
                                    source={require('../../res/icons/player.png')}
                                />
                            </View>
    
                            <View style={ layout.column80Grey } >
                                <Text style={ text.leftPaddedMediumBlack }>Defenders</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={ buttons.rectLightGreyButton }
                        onPress={ () => this.props.navigation.navigate('Midfielders') }
                    >
                        <View style={ layout.columnSeparatorGrey }>
                            <View style={ layout.column20Grey }>
                                <Image
                                    style={ image.icon }
                                    source={require('../../res/icons/player.png')}
                                />
                            </View>
    
                            <View style={ layout.column80Grey } >
                                <Text style={ text.leftPaddedMediumBlack }>Midfielders</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={ buttons.rectLightGreyButton }
                        onPress={ () => this.props.navigation.navigate('Forwards') }
                    >
                        <View style={ layout.columnSeparatorGrey }>
                            <View style={ layout.column20Grey }>
                                <Image
                                    style={ image.icon }
                                    source={require('../../res/icons/player.png')}
                                />
                            </View>
    
                            <View style={ layout.column80Grey } >
                                <Text style={ text.leftPaddedMediumBlack }>Forwards</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
            </ScrollView>
        );
    }
}
