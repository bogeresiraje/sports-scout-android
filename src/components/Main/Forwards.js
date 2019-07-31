import React, { Component } from 'react';
import { ScrollView, View, RefreshControl } from 'react-native';
import { get } from '../../data/fetch';
import LoadingIndicator from '../Helper/LoadingIndicator';
import SomethingWentWrong from '../Helper/SomethingWentWrong';
import { Player } from './PlayerList';
import layout from '../../res/styles/layout';


export class Forwards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            somethingWrong: false,
            refreshing: false,
            players: [],
        }
    }

    componentDidMount() {
        this._fetchPlayers();
    }

    _fetchPlayers = async () => {
        get('/get_forwards')
            .then(
                response => {
                    if(response.players) {
                        this.setState({ somethingWrong: false, loading: false, players: response.players });
                    } else {
                        this.setState({ loading: false, somethingWrong: true });
                    }
                },
                () => this.setState({ loading: false, somethingWrong: true })
            )
            .catch(() => this.setState({ loading: false, somethingWrong: true }) )
    }

    _refresh = async () => {
        get('/get_forwards')
            .then(
                response => {
                    if(response.players) {
                        this.setState({ somethingWrong: false, refreshing: false, players: response.players });
                    } else {
                        this.setState({ refreshing: false, somethingWrong: true });
                    }
                },
                () => this.setState({ refreshing: false, somethingWrong: true })
            )
            .catch(() => this.setState({ refreshing: false, somethingWrong: true }) )
    };

    _tryAgain = () => {
        this.setState({ loading: true, somethingWrong: false });
        this._fetchPlayers();
    }

    render() {
        const { somethingWrong, loading, refreshing, players } = this.state;

        if(loading) return <LoadingIndicator />;
        else if(somethingWrong) return <SomethingWentWrong tryAgain={ this._tryAgain } />;
        else {
            return (
                <ScrollView
                    style={ layout.paddlessContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={ refreshing }
                            onRefresh={ this._refresh }
                        />
                    }
                >

                    <View style={ layout.container }>
                    {
                        players.length ?
                            players.map((player, i) => (
                                <Player
                                    navigation={ this.props.navigation }
                                    player={ player }
                                    key={ i }
                                />
                            ))  :
                            <View></View>
                    }
                    </View>

                    <View style={ layout.padBottom }></View>

                </ScrollView>
            )
        }
    }
}
