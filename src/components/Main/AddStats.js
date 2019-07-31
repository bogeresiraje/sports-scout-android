import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, Picker, ToastAndroid,
    ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

import LoadingIndicator from '../Helper/LoadingIndicator';
import SomethingWentWrong from '../Helper/SomethingWentWrong';
import layout from '../../res/styles/layout';
import text from '../../res/styles/text';
import input from '../../res/styles/input';
import { get, send } from '../../data/fetch';
import buttons from '../../res/styles/buttons';


export default class extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            somethingWrong: false,
            activeIndicator: false,

            pageOneActive: true,
            pageTwoActive: false,
            pageThreeActive: false,

            clubs: [],

            homeClub: {},
            awayClub: {},
            homeScore: '0',
            awayScore: '0',

            homePickerOpen: false,
            awayPickerOpen: false,
            homePlayers: [],
            awayPlayers: [],
            homePlayer: {},
            awayPlayer: {},

            shotsFor: '0',
            shotsForOntarget: '0',
            goalsFor: '0',
            assists: '0',
            crosses: '0',
            crossesSuccess: '0',

            clearances: '0',
            interceptions: '0',
            tackles: '0',
            fouls: '0',
            shotsAgainst: '0',
            shotsAgainstBlocked: '0',
            goalsAgainst: '0',
            saves: '0'

        }
    }

    componentWillMount() {
        this.setState({ loading: true });
    }

    componentDidMount() {
        this._fetchClubsWithPlayers();
    }

     _fetchClubsWithPlayers = async () => {
        await get('/get_clubs_with_players')
            .then(response => {
                if(response.clubs){                  
                    const clubs = response.clubs;
                    const initialClub = clubs[0]
                    this.setState({ loading: false, somethingWrong: false, clubs: clubs,
                    homeClub: clubs[0], awayClub: clubs[0],
                    homePlayers: clubs[0].players, awayPlayers: clubs[0].players,
                    homePlayer: initialClub.players[0],
                    awayPlayer: initialClub.players[0],
                });
                }else{
                    this.setState({ loading: false, somethingWrong: true });
                }
            })
            .catch(() => this.setState({ loading: false, somethingWrong: true }) )
    };

    _submit = async () => {
        const formData = new FormData();
        if(this.state.homePickerOpen){
            formData.append('player_id', this.state.homePlayer.id);
            formData.append('player_status', 'home');
        } else {
            formData.append('player_id', this.state.awayPlayer.id);
            formData.append('player_status', 'away');
        }
        formData.append('home_id', this.state.homeClub.id);
        formData.append('away_id', this.state.awayClub.id);
        formData.append('home_score', this.state.homeScore);
        formData.append('away_score', this.state.awayScore);
        formData.append('shots_for', this.state.shotsFor);
        formData.append('shots_for_ontarget', this.state.shotsForOntarget);
        formData.append('goals_for', this.state.goalsFor);
        formData.append('assists', this.state.assists);
        formData.append('crosses', this.state.crosses);
        formData.append('crosses_successful', this.state.crossesSuccess);
        formData.append('interceptions', this.state.interceptions);
        formData.append('clearances', this.state.clearances);
        formData.append('tackles', this.state.tackles);
        formData.append('fouls', this.state.fouls);
        formData.append('shots_against', this.state.shotsAgainst);
        formData.append('shots_against_blocked', this.state.shotsAgainstBlocked);
        formData.append('goals_against', this.state.goalsAgainst);
        formData.append('saves', this.state.saves);

        this.setState({ somethingWrong: false, activeIndicator: true });

        send('/add_stats', formData)
            .then(
                response => {
                    if(response.success){
                        let playerName;
                        if(this.state.homePickerOpen){
                            playerName = `${this.state.homePlayer.first_name} ${this.state.homePlayer.last_name}`
                        }else {
                            playerName = `${this.state.awayPlayer.first_name} ${this.state.awayPlayer.last_name}`
                        }
                        this.props.navigation.navigate('PlayerProfile',
                            {
                                'playerName': playerName,
                                'playerId': response.player_id,
                                'toastMessage': 'Successfully Added Statistics',
                            }
                        );

                    }else {
                        ToastAndroid.showWithGravity(
                            'Failed to Add Stats, Check Your Inputs well',
                            ToastAndroid.LONG,
                            ToastAndroid.TOP
                        )
                    }
                },
                () => this.setState({ somethingWrong: true, activeIndicator: false })
            )
            .catch(() => this.setState({ somethingWrong: true, activeIndicator: false }))
    };

    _tryAgain = () => {
        this.setState({ loading: true, somethingWrong: false });
        this._fetchClubsWithPlayers();
    };

    _setPageOne = () => { this.setState({ pageOneActive: true, pageTwoActive: false, pageThreeActive: false }) };

    _setPageTwo = () => { this.setState({ pageOneActive: false, pageTwoActive: true, pageThreeActive: false }) };

    _setPageThree = () => { this.setState({ pageOneActive: false, pageTwoActive: false, pageThreeActive: true }) };

    _handleHomeClub = club => { this.setState({ homeClub: club }) };

    _handleAwayClub = club => { this.setState({ awayClub: club }) };

    _handleHomeScore = score => { this.setState({ homeScore: score }) };

    _handleAwayScore = score => { this.setState({ awayScore: score }) };

    _handleGoalsFor = goals => { this.setState({ goalsFor: goals })};

    _handleShotsFor = shots => { this.setState({ shotsFor: shots }) };

    _handleShotsForOntarget = shots => { this.setState({ shotsForOntarget: shots }) };

    _handleAssists = assists => { this.setState({ assists: assists }) };

    _handleCrosses = crosses => { this.setState({ crosses: crosses }) };

    _handleCrossesSuccess = crosses => { this.setState({ crossesSuccess: crosses }) };

    _handleClearances = clearances => { this.setState({ clearances: clearances }) };

    _handleInterceptions = interceptions => { this.setState({ interceptions: interceptions }) };

    _handleTackles = tackles => { this.setState({ tackles: tackles }) };

    _handleFouls = fouls => { this.setState({ fouls: fouls }) };

    _handleShotsAgainst = shots => { this.setState({ shotsAgainst: shots }) };

    _handleShotsBlocked = shots => { this.setState({ shotsAgainstBlocked: shots }) };

    _handleGoalsAgainst = goals => { this.setState({ goalsAgainst: goals }) };

    _handleSaves = saves => { this.setState({ saves: saves }) };

    _openHomePicker = () => this.setState({ homePickerOpen: true, awayPickerOpen: false })

    _handleHomePlayer = player => this.setState({homePlayer: player });

    _setHomePlayers = players => {
        this.setState({ homePlayers: players})
        if(players.length){
            this.setState({ homePlayer: players[0]})
        }
    };

    _handleAwayPlayer = player => this.setState({ awayPlayer: player })

    _setAwayPlayers = players => {
        this.setState({ awayPlayers: players });
        if(players.length){
            this.setState({ awayPlayer: players[0]})
        }
    };

    _openAwayPicker = () => this.setState({homePickerOpen: false, awayPickerOpen: true })

    render() {
        const { loading, somethingWrong, activeIndicator, goalsFor, shotsFor, shotsForOntarget, assists,
            clearances, interceptions, tackles, fouls, crosses, crossesSuccess,
            pageOneActive, pageTwoActive, pageThreeActive, shotsAgainst, shotsAgainstBlocked,
            goalsAgainst, saves, clubs } = this.state;

        if(loading){
            return (
                <LoadingIndicator />
            )
        }else if(somethingWrong){
            return (
                <SomethingWentWrong tryAgain={ this._tryAgain } />
            )
        }else {
            if(pageOneActive){
                return (
                    <PageOne
                        setPageTwo={ this._setPageTwo }
                        clubs={ clubs }
                        homeClub={ this.state.homeClub }
                        awayClub={ this.state.awayClub }
                        homeScore={ this.state.homeScore }
                        awayScore={ this.state.awayScore }

                        handleHomeClub={ this._handleHomeClub }
                        handleAwayClub={ this._handleAwayClub }
                        handleHomeScore={ this._handleHomeScore }
                        handleAwayScore={ this._handleAwayScore }

                        openHomePicker={ this._openHomePicker }
                        homePlayer={ this.state.homePlayer }
                        homePickerOpen={ this.state.homePickerOpen }
                        handleHomePlayer={ this._handleHomePlayer }
                        homePlayers={ this.state.homePlayers }
                        setHomePlayers={ this._setHomePlayers}

                        openAwayPicker={ this._openAwayPicker }
                        awayPlayer={ this.state.awayPlayer }
                        handleAwayPlayer={ this._handleAwayPlayer}
                        awayPickerOpen={ this.state.awayPickerOpen}
                        awayPlayers={ this.state.awayPlayers }
                        setAwayPlayers={ this._setAwayPlayers }
                    />
                );
            } else if(pageTwoActive){
                return (
                    <PageTwo
                        setPageOne={ this._setPageOne }
                        setPageThree={ this._setPageThree }
                        goalsFor={ goalsFor }
                        shotsFor={ shotsFor }
                        assists={ assists}
                        shotsForOntarget={ shotsForOntarget }
                        crosses={ crosses }
                        crossesSuccess={ crossesSuccess }

                        handleGoalsFor={ this._handleGoalsFor }
                        handleShotsFor={ this._handleShotsFor }
                        handleShotsForOntarget={ this._handleShotsForOntarget }
                        handleAssists={ this._handleAssists }
                        handleCrosses={ this._handleCrosses }
                        handleCrossesSuccess={ this._handleCrossesSuccess }

                        homePickerOpen={ this.state.homePickerOpen }
                        awayPickerOpen={ this.state.awayPickerOpen }
                        homePlayer={ this.state.homePlayer }
                        awayPlayer={ this.state.awayPlayer }

                    />
                );
            } else if(pageThreeActive) {
                return (
                    <PageThree
                        setPageTwo={ this._setPageTwo }
                        submit={ this._submit }

                        clearances={ clearances }
                        interceptions={ interceptions }
                        fouls={ fouls }
                        tackles={ tackles }
                        shotsAgainst={ shotsAgainst }
                        shotsAgainstBlocked={ shotsAgainstBlocked }
                        goalsAgainst={ goalsAgainst }
                        saves={ saves }
                        activeIndicator={ activeIndicator }

                        handleClearances={ this._handleClearances }
                        handleInterceptions={ this._handleInterceptions }
                        handleFouls={ this._handleFouls }
                        handleTackles={ this._handleTackles }
                        handleShotsAgainst={ this._handleShotsAgainst }
                        handleShotsBlocked={ this._handleShotsBlocked }
                        handleGoalsAgainst={ this._handleGoalsAgainst }
                        handleSaves={ this._handleSaves }

                        homePickerOpen={ this.state.homePickerOpen }
                        awayPickerOpen={ this.state.awayPickerOpen }
                        homePlayer={ this.state.homePlayer }
                        awayPlayer={ this.state.awayPlayer }
                    />
                );
            } else{
                return (
                    <View></View>
                );
            }
        }
    }
}

const PageOne = props => {
    const { clubs, homeClub, awayClub, homeScore, awayScore, handleHomeClub, handleAwayClub, handleHomeScore,
        handleAwayScore, homePickerOpen, openHomePicker, homePlayer, handleHomePlayer, homePlayers,
        setHomePlayers, awayPickerOpen, openAwayPicker, awayPlayer, handleAwayPlayer, setAwayPlayers,
        awayPlayers, setPageTwo } = props;

    return (
        <ScrollView style={ layout.container }>
            <View>
                <Text style={ input.label } >CHOOSE HOME CLUB</Text>
                <Picker
                    style={ input.picker }
                    selectedValue={ homeClub }
                    onValueChange={ (club, index) => {
                        setHomePlayers(club.players);
                        handleHomeClub(club)
                    } }
                >
                    {
                        clubs.map((club, i) => (
                            <Picker.Item label={ club.name} value={ club } key={ i } />
                        ))
                    }
                </Picker>

                <Text style={ input.label } >HOME CLUB SCORE</Text>
                <TextInput
                    style={ input.inputText }
                    value = { homeScore }
                    keyboardType='numeric'
                    onChangeText = { score => handleHomeScore(score) }
                />
            </View>

            <View>
                <Text style={ input.label } >CHOOSE AWAY CLUB</Text>
                <Picker
                    style={ input.picker }
                    selectedValue={ awayClub }
                    onValueChange={ (club, index) => {
                        setAwayPlayers(club.players);
                        handleAwayClub(club);
                    } }
                >
                    {
                        clubs.map((club, i) => (
                            <Picker.Item label={ club.name} value={ club } key={ i } />
                        ))
                    }
                </Picker>

                <Text style={ input.label } >AWAY CLUB SCORE</Text>
                <TextInput
                    style={ input.inputText }
                    value = { awayScore }
                    keyboardType='numeric'
                    onChangeText = { score => handleAwayScore(score) }
                />
            </View>

            <View>
                <TouchableOpacity
                    style={ buttons.rectGreyButton }
                    onPress={ () => openHomePicker() }
                >
                    <Text style={ text.autoWhite }>choose player from home club</Text>
                </TouchableOpacity>
                {
                    homePickerOpen ?
                        <Picker
                            style={ input.picker }
                            selectedValue={ homePlayer }
                            onValueChange={ (player, index ) => handleHomePlayer(player) }
                        >
                            {
                                homePlayers.map((player, index) => (
                                    <Picker.Item
                                        value={ player }
                                        label={ `${player.first_name } ${player.last_name}`}
                                        key={ index }
                                    />
                                ))
                            }
                        </Picker> :

                        <View></View>
                }
            </View>

            <View>
                <TouchableOpacity
                    style={ buttons.rectGreyButton }
                    onPress={ () => openAwayPicker() }
                >
                    <Text style={ text.autoWhite }>choose player from away club</Text>
                </TouchableOpacity>
                {
                    awayPickerOpen ?
                        <Picker
                            style={ input.picker }
                            selectedValue={ awayPlayer }
                            onValueChange={ (player, index ) => handleAwayPlayer(player) }
                        >
                            {
                                awayPlayers.map((player, index) => (
                                    <Picker.Item
                                        value={ player }
                                        label={ `${player.first_name } ${player.last_name}`}
                                        key={ index }
                                    />
                                ))
                            }
                        </Picker> :

                        <View></View>
                }
            </View>

            <View>
                    <TouchableOpacity
                        style={ buttons.rectArmyGreenButton50 }
                        onPress={ () => setPageTwo() }
                    >
                        <Text  style={ text.autoWhite } >Next</Text>
                    </TouchableOpacity>
            </View>

            <View style={ layout.padBottom }></View>

        </ScrollView>
    )
}

PageOne.propTypes = {
    setPageTwo: PropTypes.func.isRequired,
    clubs: PropTypes.array.isRequired,
    homeClub: PropTypes.object.isRequired,
    awayClub: PropTypes.object.isRequired,
    homeScore: PropTypes.string.isRequired,
    awayScore: PropTypes.string.isRequired,

    setHomePlayers: PropTypes.func.isRequired,
    setAwayPlayers: PropTypes.func.isRequired,

    handleHomeClub: PropTypes.func.isRequired,
    handleAwayClub: PropTypes.func.isRequired,
    handleHomeScore: PropTypes.func.isRequired,
    handleAwayScore: PropTypes.func.isRequired,
    handleHomePlayer: PropTypes.func.isRequired,
    handleAwayPlayer: PropTypes.func.isRequired,
}

const PageTwo = (props) => {
    const { setPageOne, setPageThree, goalsFor, shotsFor, shotsForOntarget, assists, crosses, crossesSuccess, handleGoalsFor,
        handleShotsFor, handleShotsForOntarget, handleAssists, handleCrosses, handleCrossesSuccess,
        homePickerOpen, awayPickerOpen, homePlayer, awayPlayer } = props;

    return(
        <ScrollView style={ layout.container } >
            {
                homePickerOpen?
                    <View>
                        <Text style={ text.centerHeadingArmyGreen} >
                            { `${homePlayer.first_name} ${homePlayer.last_name}` }
                        </Text>
                        <Text style={ text.centerBlackHeading} >
                            { homePlayer.role }
                        </Text>
                    </View> :

                    <View>
                        <Text style={ text.centerHeadingArmyGreen} >
                            { `${awayPlayer.first_name} ${awayPlayer.last_name}` }
                        </Text>
                        <Text style={ text.centerBlackHeading} >
                            { awayPlayer.role }
                        </Text>
                    </View> 
            }

            <View>
                <Text style={ input.label } >GOALS SCORED</Text>
                <TextInput
                    style={ input.inputText }
                    value = { goalsFor }
                    keyboardType='numeric'
                    onChangeText = { goals => handleGoalsFor(goals) }
                />
            </View>

            <View>
                <Text style={ input.label } >SHOTS FOR</Text>
                <TextInput
                    style={ input.inputText }
                    value = { shotsFor }
                    keyboardType='numeric'
                    onChangeText = { shots => handleShotsFor(shots) }
                />
            </View>

            <View>
                <Text style={ input.label } >SHOTS FOR ON TARGET</Text>
                <TextInput
                    style={ input.inputText }
                    value = { shotsForOntarget }
                    keyboardType='numeric'
                    onChangeText = { shots => handleShotsForOntarget(shots) }
                />
            </View>

            <View>
                <Text style={ input.label } >ASSISTS</Text>
                <TextInput
                    style={ input.inputText }
                    value = { assists }
                    keyboardType='numeric'
                    onChangeText = { assists => handleAssists(assists) }
                />
            </View>

            <View>
                <Text style={ input.label } >CROSSES</Text>
                <TextInput
                    style={ input.inputText }
                    value = { crosses }
                    keyboardType='numeric'
                    onChangeText = { crosses => handleCrosses(crosses) }
                />
            </View>

            <View>
                <Text style={ input.label } >CROSSES SUCCESSFUL</Text>
                <TextInput
                    style={ input.inputText }
                    value = { crossesSuccess }
                    keyboardType='numeric'
                    onChangeText = { crosses => handleCrossesSuccess(crosses) }
                />
            </View>

            <View style={ layout.columnSeparator } >
                <View style={ layout.column50Grey }>
                    <TouchableOpacity
                        style={ buttons.rectArmyGreenButton }
                        onPress={ () => setPageOne() }
                    >
                        <Text  style={ text.autoWhite } >Back</Text>
                    </TouchableOpacity>
                </View>

                <View style={ layout.column50Grey } >
                    <TouchableOpacity
                        style={ buttons.rectArmyGreenButton }
                        onPress={ () => setPageThree() }
                    >
                        <Text  style={ text.autoWhite } >Next</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={ layout.padBottom }></View>

        </ScrollView>
    )
}

PageTwo.propTypes = {
    setPageOne: PropTypes.func.isRequired,
    setPageThree: PropTypes.func.isRequired,
    shotsFor: PropTypes.string.isRequired,
    shotsForOntarget: PropTypes.string.isRequired,
    goalsFor: PropTypes.string.isRequired,
    assists: PropTypes.string.isRequired,
    crosses: PropTypes.string.isRequired,
    crossesSuccess: PropTypes.string.isRequired,
    handleShotsFor: PropTypes.func.isRequired,
    handleShotsForOntarget: PropTypes.func.isRequired,
    handleGoalsFor: PropTypes.func.isRequired,
    handleAssists: PropTypes.func.isRequired,
    handleCrosses: PropTypes.func.isRequired,
    handleCrossesSuccess: PropTypes.func.isRequired,
}


const PageThree = (props) => {
    const { setPageTwo, submit, clearances, interceptions, fouls, tackles, shotsAgainst,
        shotsAgainstBlocked, goalsAgainst, saves, handleClearances, handleInterceptions, handleFouls,
        handleTackles, handleShotsAgainst, handleShotsBlocked, handleGoalsAgainst, handleSaves,
        homePickerOpen, awayPickerOpen, homePlayer, awayPlayer, activeIndicator } = props;

    return (
        <ScrollView style={ layout.container } >

            {
                homePickerOpen?
                    <View>
                        <Text style={ text.centerHeadingArmyGreen} >
                            { `${homePlayer.first_name} ${homePlayer.last_name}` }
                        </Text>
                        <Text style={ text.centerBlackHeading} >
                            { homePlayer.role }
                        </Text>
                    </View> :

                    <View>
                        <Text style={ text.centerHeadingArmyGreen} >
                            { `${awayPlayer.first_name} ${awayPlayer.last_name}` }
                        </Text>
                        <Text style={ text.centerBlackHeading} >
                            { awayPlayer.role }
                        </Text>
                    </View> 
            }

            <View>
                <Text style={ input.label } >CLEARANCES</Text>
                <TextInput
                    style={ input.inputText }
                    value = { clearances }
                    keyboardType='numeric'
                    onChangeText = { clearances => handleClearances(clearances) }
                />
            </View>

            <View>
                <Text style={ input.label } >INTERCEPTIONS</Text>
                <TextInput
                    style={ input.inputText }
                    value = { interceptions }
                    keyboardType='numeric'
                    onChangeText = { interceptions => handleInterceptions(interceptions) }
                />
            </View>

            <View>
                <Text style={ input.label } >TACKLES</Text>
                <TextInput
                    style={ input.inputText }
                    value = { tackles }
                    keyboardType='numeric'
                    onChangeText = { tackles => handleTackles(tackles) }
                />
            </View>

            <View>
                <Text style={ input.label } >FOULS</Text>
                <TextInput
                    style={ input.inputText }
                    value = { fouls }
                    keyboardType='numeric'
                    onChangeText = { fouls => handleFouls(fouls) }
                />
            </View>

            <View>
                <Text style={ input.label } >SHOTS AGAINST</Text>
                <TextInput
                    style={ input.inputText }
                    value = { shotsAgainst }
                    keyboardType='numeric'
                    onChangeText = { shots => handleShotsAgainst(shots) }
                />
            </View>

            <View>
                <Text style={ input.label } >SHOTS BLOCKED</Text>
                <TextInput
                    style={ input.inputText }
                    value = { shotsAgainstBlocked }
                    keyboardType='numeric'
                    onChangeText = { shots => handleShotsBlocked(shots) }
                />
            </View>

            <View>
                <Text style={ input.label } >GOALS CONCEDED</Text>
                <TextInput
                    style={ input.inputText }
                    value = { goalsAgainst }
                    keyboardType='numeric'
                    onChangeText = { goals => handleGoalsAgainst(goals) }
                />
            </View>

            <View>
                <Text style={ input.label } >SAVES</Text>
                <TextInput
                    style={ input.inputText }
                    value = { saves }
                    keyboardType='numeric'
                    onChangeText = { saves => handleSaves(saves) }
                />
            </View>

            <View style={ layout.columnSeparator } >
                <View style={ layout.column50Grey }>
                    <TouchableOpacity
                        style={ buttons.rectArmyGreenButton }
                        onPress={ () => setPageTwo() }
                    >
                        <Text  style={ text.autoWhite } >Back</Text>
                    </TouchableOpacity>
                </View>

                <View style={ layout.column50Grey } >
                    {
                        !activeIndicator ?
                         <TouchableOpacity
                             style={ buttons.rectArmyGreenButton} 
                             onPress = { () => submit() }
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
                </View>
            </View>

            <View style={ layout.padBottom } ></View>
        </ScrollView>
    )
}

PageThree.propTypes = {
    setPageTwo: PropTypes.func.isRequired,
    clearances: PropTypes.string.isRequired,
    interceptions: PropTypes.string.isRequired,
    tackles: PropTypes.string.isRequired,
    shotsAgainst: PropTypes.string.isRequired,
    shotsAgainstBlocked: PropTypes.string.isRequired,
    goalsAgainst: PropTypes.string.isRequired,
    saves: PropTypes.string.isRequired,

    submit: PropTypes.func.isRequired,
}
