import React, { Component } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { get, getHost } from '../../data/fetch';
import cards from '../../res/styles/cards';
import text from '../../res/styles/text';


 export default class TechnicalList extends Component {
     constructor(props) {
         super(props);
         this.state = {
            technicalList: [],
            loading: true,
            somethingWrong: false,
        }
     }

     componentDidMount() {
        this.fetch_players();
    }

    fetch_players = async () => {
       this.setState({ loading: true });
       await get('/get_technical_list')
           .then(
               response => response.technical_list,
               () => { this.setState({ loading: false, somethingWrong: true } ) }
           )
           .then(
               technical_list => { this.setState({ technicalList: technical_list, loading: false } ) },
               () => { this.setState({ loading: false, somethingWrong: true } ) }
           )
           .catch(() => { this.setState({ loading: false, somethingWrong: true } ) })
    }

    tryAgain = () => { this.fetch_players(); }

    render() {
       const { loading, technicalList, somethingWrong } = this.state;
       if(loading) { return (<LoadingIndicator />) }
       else if(somethingWrong) { return <SomethingWentWrong tryAgain={ this.tryAgain } /> }
       else {
            let mid = Math.floor(technicalList.length / 2);
            mid = mid === 0 ? Math.ceil(technicalList.length / 2): mid;
            const left = technicalList.slice(0, mid);
            const right = technicalList.slice(mid, technicalList.length);
            return (
                <ScrollView >
                    <View style={ cards.twoColumn }>
                        <View style={ cards.column }>
                            {
                                left.map((technical, index) => (
                                    <Technical
                                        technical={ technical }
                                        key={ index }
                                        navigation={ this.props.navigation }
                                    />
                                ))
                            }
                        </View>

                        <View style={ cards.column }>
                            {
                                right.map((technical, index) => (
                                    <Technical
                                        technical={ technical } 
                                        key={ index } 
                                        navigation={ this.props.navigation }
                                    />
                                )) 
                            }
                        </View>
                    </View>
                </ScrollView>
            )
       }
    }
 }

 
 const Technical = ({ technical }) => (
    <View style={ cards.profileCard } >
        <Text style={ text.centerBlackTitle }>{ technical.name }</Text>
        <Image
           style={ cards.profileImage }
           source={{uri: `${getHost.host}/uploads/player_images/${technical.image_url}`}}
        />
        <Text style={ text.centerDullBlack }>{ technical.role }</Text>
    </View>
)