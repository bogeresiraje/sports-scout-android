import React from 'react';
import { View, StatusBar } from 'react-native';
import {createAppContainer, createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation';
import ReplyList from './ReplyList';
import More from './More'
import ViewsList from './ViewsList';
import Login from './moreComponents/Login';
import About from './moreComponents/About';
import TechnicalList from './moreComponents/TechnicalStaff';
import CreateAccount from './moreComponents/CreateAccount';
import Matches from './moreComponents/Matches';
import Profile from './moreComponents/Profile';
import PlayerList from './PlayerList';
import AddPlayer from './moreComponents/AddPlayer';
import Statistics from './moreComponents/Statistics';
import TableStandings from './moreComponents/TableStandings';
import Feedback from './moreComponents/Feedback';
import ChooseAccount from './moreComponents/ChooseAccount';
import CreateManagerAccount from './moreComponents/CreateManagerAccount';
import CreateScoutAccount from './moreComponents/CreateScoutAccount';
import ConfirmAccount from './moreComponents/ConfirmAccount';
import Clubs from './moreComponents/Clubs';
import AddClub from './moreComponents/AddClub';
import PostView from './PostView';
import color from '../res/styles/color';


const HomeScreen = (props) => (
    <View>
        <StatusBar backgroundColor={ color.statusBarColor } barStyle='light-content' />
        <PlayerList navigation={ props.navigation } />
    </View>    
)

const ViewsScreen = (props) => (
    <ViewsList navigation={ props.navigation } />
)

const MoreScreen = (props) => (
    <More navigation={ props.navigation } />
)

const TopTabNavigator = createMaterialTopTabNavigator(
    {
        Home: HomeScreen,
        Views: ViewsScreen,
        More: MoreScreen,
    },
    {
        initialRouteName: "Home",
        tabBarOptions: {
            indicatorStyle: {
                backgroundColor: "#FFFFFF",
            },
            style: {
                backgroundColor: color.theme,
            },
        },
    }
);

const TopTab = createAppContainer(TopTabNavigator);

const stackNavigator = createStackNavigator(
    {
        Main: {
            screen: TopTab,
            navigationOptions: () => ({headerTitle: "Sports Scout", ...navConfig, headerTitleStyle: {
                paddingLeft: '5%',
                flex: 1,
            }})
        },
        Login: {
            screen: Login,
            navigationOptions: () => ({headerTitle: "Sports Scout", ...navConfig})
        },
        PostView: {
            screen: PostView,
            navigationOptions: () => ({headerTitle: "post", ...navConfig})
        },
        Replies: {
            screen: ReplyList,
            navigationOptions: () => ({headerTitle: "replies", ...navConfig})
        },
        About: {
            screen: About,
            navigationOptions: () => ({headerTitle: "about", ...navConfig})
        },
        TechnicalStaff: {
            screen: TechnicalList,
            navigationOptions: () => ({headerTitle: "technical staff", ...navConfig})
        },
        CreateAccount: {
            screen: CreateAccount,
            navigationOptions: () => ({headerTitle: "create account", ...navConfig})
        },
        Matches: {
            screen: Matches,
            navigationOptions: () => ({headerTitle: "matches", ...navConfig})
        },
        Profile: {
            screen: Profile,
            navigationOptions: () => ({headerTitle: "profile", ...navConfig})
        },
        Feedback: {
            screen: Feedback,
            navigationOptions: () => ({headerTitle: "feedack", ...navConfig})
        },
        Clubs: {
            screen: Clubs,
            navigationOptions: () => ({headerTitle: "clubs", ...navConfig})
        },
        AddClub: {
            screen: AddClub,
            navigationOptions: () => ({headerTitle: "add club", ...navConfig})
        },
        Players: {
            screen: PlayerList,

            navigationOptions: () => ({headerTitle: "players", ...navConfig})
        },
        AddPlayer: {
            screen:AddPlayer,

            navigationOptions: () => ({headerTitle: "add player", ...navConfig})
        },
        Statistics: {
            screen: Statistics,
            navigationOptions: () => ({headerTitle: "statistics", ...navConfig})
        },
        TableStandings: {
            screen: TableStandings,
            navigationOptions: () => ({headerTitle: "table standings", ...navConfig})
        },
        ChooseAccount: {
            screen: ChooseAccount,
            navigationOptions: () => ({headerTitle: "choose account", ...navConfig})
        },
        CreateManagerAccount: {
            screen: CreateManagerAccount,
            navigationOptions: () => ({headerTitle: "manager account", ...navConfig})
        },
        CreateScoutAccount: {
            screen: CreateScoutAccount,
            navigationOptions: () => ({headerTitle: "scout account", ...navConfig})
        },
        ConfirmAccount: {
            screen: ConfirmAccount,
            navigationOptions: () => ({headerTitle: "confirm account", ...navConfig})
        },
    },
    {
        mode: 'modal',
        headerMode: 'float',
        headerTransitionPreset: 'fade-in-place',
    }
)

const navConfig = {
    headerStyle: {
        backgroundColor: color.theme,
        color: 'white',
        tintColor: 'white',
        elevation: 0,
       
        shadowOpacity: 0,
        borderBottomWidth: 0,
        
    },
    headerTitleStyle: {
        color: '#fff'
    },
    headerTintColor: 'white',
}

export default createAppContainer(stackNavigator);
