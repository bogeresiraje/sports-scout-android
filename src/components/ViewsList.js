import React, { Component } from 'react';
import { View, ScrollView, Text, TouchableOpacity, RefreshControl } from 'react-native';
import LoadingIndicator from './LoadingIndicator';
import SomethingWentWrong from './SomethingWentWrong';
import { get } from '../data/fetch';
import styles from '../res/styles/views';
import inputStyles from '../res/styles/input';
import layout from '../res/styles/layout';
import cards from '../res/styles/cards';


class ViewsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            refreshing: false,
            somethingWrong: false,
            viewsList: [],
            isReplyFormOpen: false,
        };
    }

    componentDidMount() {
        this.fetch_views();
    }

    _onRefresh = async () => {
        this.setState({ refreshing: true });
        await get('/get_views')
            .then(
                result => {
                    const views = result.views;
                    this.setState({ viewsList: views, refreshing: false })
                },
                () => { this.setState({ somethingWrong: true } ) }
            )
            .catch(() => { this.setState({ somethingWrong: true } ) })
    }

    fetch_views = async () => {
        this.setState( { loading: true } );
        await get('/get_views')
            .then(
                result => {
                    const viewsList = result.views;
                    this.setState({ viewsList: viewsList, loading: false, somethingWrong: false })
                },
                () => { this.setState({ loading: false, somethingWrong: true } ) }
            )
            .catch(() => { this.setState({ loading: false, somethingWrong: true } ) })
    }

    tryAgain = async () => {
        this.fetch_views();
    }

    updateViews = (viewObject) => {
        this.setState({viewsList: [...this.state.viewsList, viewObject]});
    }

    render() {
        const { loading, viewsList, somethingWrong } = this.state;

        if(loading){ return (<LoadingIndicator />)}
        else if(somethingWrong) { return (<SomethingWentWrong tryAgain={ this.tryAgain } /> )}
        else {
            return (
                <View style={ layout.paddlessContainer } >
                    <View style={ layout.container }>
                    <TouchableOpacity
                            style={ inputStyles.postButton }
                            onPress={ () => { this.props.navigation.navigate('PostView', { updateViews: this.updateViews})} }
                        >
                            <Text  style={ inputStyles.postText } >post a view</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={ this.state.refreshing }
                                onRefresh={ this._onRefresh }
                            />
                        }
                    >
                        <View style={ layout.inScrollContainer } >
                        {
                             viewsList.length ?
                                viewsList.map((v, i) => (
                             <UniView
                                 view={v} 
                                 key={i} 
                                 navigation={ this.props.navigation }
                             />
                             )) :
                             <View style={ styles.viewsContainer }>
                                 <Text style={ styles.nullResponse }>No Views to Display</Text>
                             </View>
                        }
                        </View>
                    </ScrollView>

                </View>
            )
        }
    }
}

const UniView = ({ view, navigation }) => (
    <View style={ cards.card} >
        <View style={styles.body} >
            <View><Text style={styles.header}>{view.creator}</Text></View>
            <View><Text>{view.body}</Text></View>
            <View style={styles.timestamp}><Text style={styles.blackText}>{view.timestamp}</Text></View>
        </View>
        
        <View style={styles.replies} >
                <TouchableOpacity
                    onPress={() => { navigation.navigate('Replies', {viewId: view.id})}} >
                    <Text style={ inputStyles.blackTextBtn }>
                        {(view.replies_length == 1)?
                            `1 reply`:
                             `${view.replies_length} replies`
                        }
                    </Text>
                </TouchableOpacity>
        </View>
    </View>
)


export default ViewsList;
