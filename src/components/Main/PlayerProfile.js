import React, { Component } from 'react';
import { Text, ScrollView, View, Image, ToastAndroid } from 'react-native';
import { VictoryGroup, VictoryLine, VictoryChart, VictoryTheme } from 'victory-native';
import LoadingIndicator from '../Helper/LoadingIndicator';
import SomethingWentWrong from '../Helper/SomethingWentWrong';
import layout from '../../res/styles/layout';
import cards from '../../res/styles/cards';
import image from '../../res/styles/image';
import { send, getHost } from '../../data/fetch';
import text from '../../res/styles/text';


export default class extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            somethingWrong: false,
            current: [],
            expected: []
        }
    }

    static navigationOptions = ({ navigation, navConfig }) => {
        const { params } = navigation.state;

        return {
            title: params.playerName? params.playerName: 'player',
        }
    }

    componentWillMount(){
        this.setState({ loading: true });
    }

    componentDidMount(){
        this._fetchPlayer();
    }

    _fetchPlayer = async () => {
        const playerId = this.props.navigation.getParam('playerId');
        const formData = new FormData();
        formData.append('player_id', playerId);

        await send('/get_player_with_stats', formData)
            .then(
                response => {
                    if(response.player){
                        this.setState({ somethingWrong: false, loading: false,
                            player: response.player, expected: response.player.expected,
                        current: response.player.current })

                        // If toast mesage exists
                        if(this.props.navigation.getParam('toastMessage')){
                            // toast
                            ToastAndroid.showWithGravity(
                                this.props.navigation.getParam('toastMessage'),
                                ToastAndroid.LONG,
                                ToastAndroid.TOP,
                            )
                        }

                    }else{
                        this.setState({ somethingWrong: true, loading: false});
                    }
                },
                () => this.setState({ somethingWrong: true, loading: false})
            )
            .catch(() => this.setState({ somethingWrong: true, loading: false}))
    }

    _tryAgain = () => {
        this.setState({ loading: true, somethingWrong: false });
        this._fetchPlayer();
    };

    render(){
        const { loading, somethingWrong, player, current, expected } = this.state;

        if(loading) { return <LoadingIndicator />}

        else if(somethingWrong){ return <SomethingWentWrong tryAgain={ this._tryAgain }/> }

        else return (
            <ScrollView style={ layout.container }>
                <View style={ cards.rectCard }>
                    <View style={ layout.columnSeparator }>
                        <View style={ layout.column30 }>
                            <Text style={ text.boldBlack }>NAMES</Text>
                        </View>
                        <View style={ layout.column70 }>
                            <Text style={ text.leftPaddedGreen }>{ `${player.first_name} ${player.last_name}` }</Text>
                        </View>
                    </View>

                    <View>
                        <Image
                            style={ image.rectPhoto }
                            source={ {uri: `${getHost.host}/uploads/player_images/${player.photo_name}`} }
                        />
                    </View>

                    <View style={ layout.columnSeparator }>
                        <View style={ layout.column30 }>
                            <Text style={ text.boldBlack }>POSITION</Text>
                        </View>
                        <View style={ layout.column70 }>
                            <Text style={ text.leftPaddedGreen }>{ player.role }</Text>
                        </View>
                    </View>

                    <View style={ layout.columnSeparator }>
                        <View style={ layout.column30 }>
                            <Text style={ text.boldBlack }>RATING</Text>
                        </View>
                        <View style={ layout.column70 }>
                            <Text style={ text.leftPaddedGreen }>{ player.curr_perf }</Text>
                        </View>
                    </View>

                    <View style={ layout.padBottomWhite }></View>
                    
                    <View>
                        <Text style={ text.boldBlack }>VISUAL PERFORMANCE</Text>
                        <View style={ layout.borderColumn100 }>
                            <Text style={ text.leftSmallMediumBlack }>performance</Text>
                            <VictoryGroup
                            >
                                <VictoryChart
                                    width={ 300 } 
                                    height={ 200 }
                                    theme={ VictoryTheme.material }
                                >
                                    <VictoryLine
                                        interpolation="basis"
                                        style={{
                                            data: {
                                                fill: "#0745C2", fillOpacity: 0.0, stroke: "#0745C2", strokeWidth: 3
                                                
                                            },
                                            parent: { border: "1px solid #ccc"}
                                        }}
                                        data={ current }
                                        x="week"
                                        y="performance"
                                    />
                                </VictoryChart>

                                <VictoryChart width={ 300 } >
                                    <VictoryLine
                                        style={{
                                            data: {
                                                fill: "#5faa5a", fillOpacity: 0.0, stroke: "#5faa5a", strokeWidth: 3
                                                
                                            },
                                            parent: { border: "1px solid #ccc"}
                                        }}
                                        interpolation="basis"
                                        data={ expected }
                                        x="week"
                                        y="performance"
                                    />
                                </VictoryChart>
                            </VictoryGroup>

                            <Text style={ text.autoSmallMediumBlack }>number of matches</Text>

                            <View style={ layout.padBottomWhite }></View>

                            <View style={ layout.columnSeparator}>
                                <View style={ layout.column30}>
                                    <Text style={ text.leftPaddedNavyBlue }>blue:</Text>
                                    <Text style={ text.leftPaddedGreen }>green:</Text>
                                </View>

                                <View style={ layout.column70 }>
                                    <Text style={ text.leftPaddedMediumBlack }>recent performance</Text>
                                    <Text style={ text.leftPaddedMediumBlack }>expected future performance</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={ layout.padBottomWhite }></View>

                    <View>
                        <Text style={ text.boldBlack }>OVERALL PERFORMANCE</Text>
                    </View> 

                    {
                        player.role === 'Goal Keeper' || player.role === 'goal keeper' || player.role === 'Goal Keeper ' ?
                            <View>
                                <View style={ layout.columnSeparator }>
                                    <View style={ layout.column70Bordered }>
                                        <Text>MATCHES PLAYED</Text>
                                    </View>
                                    <View style={ layout.column30Bordered }>
                                        <Text style={ text.boldBlack }>{ player.num_matches}</Text>
                                    </View>
                                </View>

                                <View style={ layout.columnSeparator }>
                                    <View style={ layout.column70Bordered }>
                                        <Text style={ text.mediumBlack }>SAVES</Text>
                                    </View>
                                    <View style={ layout.column30Bordered }>
                                        <Text style={ text.boldBlack }>{ player.saves }</Text>
                                    </View>
                                </View>

                                <View style={ layout.columnSeparator }>
                                    <View style={ layout.column70Bordered }>
                                        <Text style={ text.mediumBlack }>GOALS CONCEDED</Text>
                                    </View>
                                    <View style={ layout.column30Bordered }>
                                        <Text style={ text.boldBlack }>{ player.goals_against}</Text>
                                    </View>
                                </View>

                                <View style={ layout.columnSeparator }>
                                    <View style={ layout.column70Bordered }>
                                        <Text style={ text.mediumBlack }>ASSISTS</Text>
                                    </View>
                                    <View style={ layout.column30Bordered }>
                                        <Text style={ text.boldBlack }>{ player.assists}</Text>
                                    </View>
                                </View>

                                <View style={ layout.columnSeparator }>
                                    <View style={ layout.column70Bordered }>
                                        <Text style={ text.mediumBlack }>GOALS</Text>
                                    </View>
                                    <View style={ layout.column30Bordered }>
                                        <Text style={ text.boldBlack }>{ player.goals_for}</Text>
                                    </View>
                                </View>

                            </View>:
                            
                            <View>
                                <View style={ layout.columnSeparator }>
                                    <View style={ layout.column70Bordered }>
                                        <Text style={ text.mediumBlack }>MATCHES PLAYED</Text>
                                    </View>
                                    <View style={ layout.column30Bordered }>
                                        <Text style={ text.boldBlack }>{ player.num_matches }</Text>
                                    </View>
                                </View>

                                <View style={ layout.columnSeparator }>
                                    <View style={ layout.column70Bordered }>
                                        <Text style={ text.mediumBlack }>CROSSES</Text>
                                    </View>
                                    <View style={ layout.column30Bordered }>
                                        <Text style={ text.boldBlack }>{ player.crosses }</Text>
                                    </View>
                                </View>

                                <View style={ layout.columnSeparator }>
                                    <View style={ layout.column70Bordered }>
                                        <Text style={ text.mediumBlack }>CROSSES SUCCESSFUL</Text>
                                    </View>
                                    <View style={ layout.column30Bordered }>
                                        <Text style={ text.boldBlack }>{ player.crosses_successful }</Text>
                                    </View>
                                </View>

                                <View style={ layout.columnSeparator }>
                                    <View style={ layout.column70Bordered }>
                                        <Text style={ text.mediumBlack }>GOALS</Text>
                                    </View>
                                    <View style={ layout.column30Bordered }>
                                        <Text style={ text.boldBlack }>{ player.goals_for}</Text>
                                    </View>
                                </View>

                                <View style={ layout.columnSeparator }>
                                    <View style={ layout.column70Bordered }>
                                        <Text style={ text.mediumBlack }>ASSISTS</Text>
                                    </View>
                                    <View style={ layout.column30Bordered }>
                                        <Text style={ text.boldBlack }>{ player.assists}</Text>
                                    </View>
                                </View>

                                <View style={ layout.columnSeparator }>
                                    <View style={ layout.column70Bordered }>
                                        <Text style={ text.mediumBlack }>SHOTS</Text>
                                    </View>
                                    <View style={ layout.column30Bordered }>
                                        <Text style={ text.boldBlack }>{ player.shots_for }</Text>
                                    </View>
                                </View>

                                <View style={ layout.columnSeparator }>
                                    <View style={ layout.column70Bordered } >
                                        <Text style={ text.mediumBlack }>SHOTS ON TARGET</Text>
                                    </View>
                                    <View style={ layout.column30Bordered }>
                                        <Text style={ text.boldBlack }>{ player.shots_for_ontarget}</Text>
                                    </View>
                                </View>

                                <View style={ layout.columnSeparator }>
                                    <View style={ layout.column70Bordered }>
                                        <Text style={ text.mediumBlack }>TACKLES</Text>
                                    </View>
                                    <View style={ layout.column30Bordered }>
                                        <Text style={ text.boldBlack }>{ player.tackles }</Text>
                                    </View>
                                </View>

                                <View style={ layout.columnSeparator }>
                                    <View style={ layout.column70Bordered }>
                                        <Text style={ text.mediumBlack }>FOULS</Text>
                                    </View>
                                    <View style={ layout.column30Bordered }>
                                        <Text style={ text.boldBlack }>{ player.fouls }</Text>
                                    </View>
                                </View>

                                <View style={ layout.columnSeparator }>
                                    <View style={ layout.column70Bordered }>
                                        <Text style={ text.mediumBlack }>INTERCEPTIONS</Text>
                                    </View>
                                    <View style={ layout.column30Bordered }>
                                        <Text style={ text.boldBlack }>{ player.interceptions }</Text>
                                    </View>
                                </View>

                                <View style={ layout.columnSeparator }>
                                    <View style={ layout.column70Bordered }>
                                        <Text style={ text.mediumBlack }>CLEARANCES</Text>
                                    </View>
                                    <View style={ layout.column30Bordered }>
                                        <Text style={ text.boldBlack }>{ player.clearances }</Text>
                                    </View>
                                </View>

                                <View style={ layout.columnSeparator }>
                                    <View style={ layout.column70Bordered }>
                                        <Text style={ text.mediumBlack }>SHOTS BLOCKED</Text>
                                    </View>
                                    <View style={ layout.column30Bordered }>
                                        <Text style={ text.boldBlack }>{ player.shots_blocked }</Text>
                                    </View>
                                </View>

                            </View>
                    }
  

                </View>

                <View style={ layout.padBottom }></View>

            </ScrollView>
        )
    }
}
