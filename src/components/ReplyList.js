import React, { Component } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, AsyncStorage } from 'react-native';
import { get, send } from '../data/fetch';
import styles from '../res/styles/views';
import inputStyles from '../res/styles/input';
import SomethingWentWrong from './SomethingWentWrong';
import LoginPrompt from './moreComponents/LoginPrompt';
import layout from '../res/styles/layout';


class ReplyList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reply: '',
            loading: true,
            replies: [],
            somethingWrong: false,
            viewId: 0,
            loggedin: true,
        }
    }

    componentWillMount() {
        const viewId = this.props.navigation.getParam('viewId');
        this.setState({ viewId: viewId});
    }

    componentDidMount() {
        this.fetch_replies();
    }

    fetch_replies = () => {
        this.setState({ loading: true });
        const { viewId } = this.state;
        get(`/get_replies/${viewId}`)
            .then(
                response => response.replies,
                () => { this.setState({ loading: false, somethingWrong: true }) }
            )
            .then(
                replies => { this.setState({ replies: replies, loading: false }) }
            )
            .catch(() => this.setState({ loading: false, somethingWrong: true }))
    }

    sendReply = async () => {
        const { reply, viewId } = this.state;
        const formData = new FormData();
        await AsyncStorage.getItem('user', (error, response) => {
            let result = JSON.parse(response);
            if(result) {
                formData.append('creatorId', result.id);
                formData.append('body', reply);
                formData.append('viewId', viewId);
                send('/post_reply', formData)
                    .then(
                        response => response.reply,
                        () => { this.setState({ loading: false, somethingWrong: true})}
                    )
                    .then(replyObj => { 
                        if(replyObj.id){
                            this.setState({ replies: [...this.state.replies, replyObj]})
                        }
                        })
                    .catch(() => { this.setState({ loading: false, somethingWrong: true})})
            }else {
                this.setState({ loading: false, loggedin: false });
            }
        })

    }

    loginPrompt = () => { this.props.navigation.navigate('Login'); };

    tryAgain = () => { this.setState({ loading: false, somethingWrong: false }) };

    handleReplySend = () => {
        this.sendReply();
        this.setState({reply: ''});
    }

    render() {
        const { replies, loggedin , loading, somethingWrong} = this.state;
        if(loading){ return (<LoadingIndicator />)}
        if(!loggedin) { return (<LoginPrompt login={ this.loginPrompt} />)}
        else if(somethingWrong){ return (<SomethingWentWrong tryAgain={ this.tryAgain }/>) }
        else {
            return (
                <View style={ layout.paddlessContainer }>
                    <View style={ styles.twoColumnContainer } >
                        <View style={ styles.twoColumn80 }>
                            <TextInput 
                                style={ inputStyles.textInput }
                                placeholder="write reply....."
                                value={ this.state.reply }
                                onChangeText={ text => { this.setState({ reply: text })} }
                            />
                        </View>

                        <View style={ styles.twoColumn20 }>
                            <TouchableOpacity
                                onPress={ () => { this.handleReplySend() } } style={ inputStyles.replySendButton }>
                                <Text style={ inputStyles.replySendButtonText }>send</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView style={ layout.inScrollContainer } >
                        <View style={ styles.activityContainer }>
                            {
                                replies.length ?
                                    replies.map((r, i) => (
                                        <Reply
                                            reply={ r } 
                                            key={ i} 
                                        />
                                    )):
                                    
                                    <View style={ styles.viewsContainer }>
                                        <Text style={ styles.nullResponse }>No Replies</Text>
                                    </View>
                            }
                        </View>
                    </ScrollView>

                    <View style={ layout.sparse } ><Text> </Text></View>

            </View>
            )
        }
    }
}

const Reply = ({ reply }) => {
    return (
        <View style={ styles.tile }>
            <Text style={ styles.head }>{ reply.creator }</Text>
            <Text style={ styles.body }>{ reply.body }</Text>
            <Text style={ styles.timestamp }>{ reply.timestamp }</Text>
        </View>
    )
}

export default ReplyList;
