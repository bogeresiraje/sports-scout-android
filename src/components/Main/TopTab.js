import React from 'react';
import { View, StatusBar } from 'react-native';
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation';
import Clubs from './Clubs';
import PlayerList from './PlayerList';
import More from './More'


const HomeScreen = (props) => (
    <View>
        <StatusBar backgroundColor={ color.statusBarColor } barStyle='light-content' />
        <PlayerList navigation={ props.navigation } />
    </View>    
)

const ClubsScreen = (props) => (
    <Clubs navigation={ props.navigation } />
)

const MoreScreen = (props) => {
    return (
        <More navigation={ props.navigation }  />
    )
}

const TopTabNavigator = createMaterialTopTabNavigator(
    {
        Home: HomeScreen,
        Clubs: ClubsScreen,
        More: MoreScreen,
    },
    {
        initialRouteName: "Home",
        tabBarOptions: {
            indicatorStyle: {
                backgroundColor: "#FFFFFF",
            },
            style: {
                backgroundColor: color.armyGreen,
            },
        },
    }
);

export default createAppContainer(TopTabNavigator);
