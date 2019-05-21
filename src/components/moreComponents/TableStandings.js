import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { get } from '../../data/fetch';
import LoadingIndicator from '../LoadingIndicator';
import SomethingWentWrong from '../SomethingWentWrong';
import layout from '../../res/styles/layout';
import inputStyles from '../../res/styles/input';
import cards from '../../res/styles/cards';


 export default class TableStandings extends Component {
     constructor(props) {
         super(props);
         this.state = {
             table: [],
             loading: false,
             somethingWrong: false,
         }
     }

     componentWillMount() {
         this.setState({ loading: true });
     }

     componentDidMount(){
         this.fetch_table();
     }

     fetch_table = () => {
         this.setState({ loading: true });
         get('/get_table')
            .then(
                response => response.table,
                () => { this.setState({ loading: false, somethingWrong: true })}
            )
            .then(table => { this.setState({table: table, loading: false })})
            .catch(() => { this.setState({ loading: false, somethingWrong: true })})
     }

     tryAgain = () => { this.fetch_table() }

     render() {
        const { table, loading, somethingWrong } = this.state;
        if(loading) {
            return (<LoadingIndicator />);
        }
         else if(somethingWrong) {
             return(<SomethingWentWrong tryAgain={ this.tryAgain } />)
        }
        else {
             return (
                 
                 <ScrollView style={ layout.container }>
                    <View style={ cards.card }>
                    <View style={ layout.columnSeparator }>

                        

                        <View style={ layout.column40 }>
                            <Text style={ inputStyles.leftBlackTextBold }>Club</Text>
                            {
                                table.map((club, i) => (
                                    <ClubNames
                                        key={ i }
                                        club={ club }
                                        index={ i }
                                    />
                                ))
                            }
                        </View>

                        <ScrollView horizontal={ true } style={ layout.horizontalScroll60 }>

                            <View>

                                <View style={ layout.columnSeparator } >
                                    <View style={ layout.column40px }>
                                        <Text style={ inputStyles.blackTextBold } >MP</Text>
                                    </View>

                                    <View style={ layout.column40px }>
                                        <Text style={ inputStyles.blackTextBold } >W</Text>
                                    </View>

                                    <View style={ layout.column40px }>
                                        <Text style={ inputStyles.blackTextBold } >D</Text>
                                    </View>

                                    <View style={ layout.column40px }>
                                        <Text style={ inputStyles.blackTextBold } >L</Text>
                                    </View>

                                    <View style={ layout.column40px }>
                                        <Text style={ inputStyles.blackTextBold } >Pts</Text>
                                    </View>

                                    <View style={ layout.column40px }>
                                        <Text style={ inputStyles.blackTextBold } >GF</Text>
                                    </View>

                                    <View style={ layout.column40px }>
                                        <Text style={ inputStyles.blackTextBold } >GA</Text>
                                    </View>

                                    <View style={ layout.column40px }>
                                        <Text style={ inputStyles.blackTextBold } >GD</Text>
                                    </View>
                                </View>

                                {
                                    table.map((club, i) => (
                                        <ClubRow
                                            key={ i }
                                            club={ club }
                                        />
                                    ))
                                }
                            </View>

                        </ScrollView>

                    </View>
                    </View>
                    </ScrollView>
                
             )
         }
     }
 }


 const ClubNames = ({ club, index }) => (
     <View style={ layout.columnSeparator} >
        <View style={ layout.column20 }>
            <Text style={ inputStyles.leftDullBlackText } >{ index + 1 }</Text>
        </View>

        <View style={ layout.column80 }>
            <Text  style={ inputStyles.leftDullBlackText } >{ club.name }</Text>
        </View>
     </View>
 )


 const ClubRow = ({ club }) => (
     <View style={ layout.columnSeparator }>
       
        <View style={ layout.column40px }>
            <Text style={ inputStyles.dullBlackText } >{ club.plays }</Text>
        </View>

        <View style={ layout.column40px }>
            <Text style={ inputStyles.dullBlackText } >{ club.wins }</Text>
        </View>

        <View style={ layout.column40px }>
            <Text style={ inputStyles.dullBlackText } >{ club.draws }</Text>
        </View>

        <View style={ layout.column40px }>
            <Text style={ inputStyles.dullBlackText } >{ club.losses }</Text>
        </View>

        <View style={ layout.column40px }>
            <Text style={ inputStyles.boldBlackText } >{ club.points }</Text>
        </View>

        <View style={ layout.column40px }>
            <Text style={ inputStyles.dullBlackText } >{ club.goals_for }</Text>
        </View>

        <View style={ layout.column40px }>
            <Text style={ inputStyles.dullBlackText } >{ club.goals_against }</Text>
        </View>

        <View style={ layout.column40px }>
            <Text style={ inputStyles.dullBlackText } >{ club.goal_diff }</Text>
        </View>


     </View>
 )