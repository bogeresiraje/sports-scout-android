import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import AuthLoading from './Helper/AuthLoading';
import TopTab from './Main/TopTab';

import Login from './Authentication/Login';
import CreateAccount from './Authentication/CreateAccount';
import ChooseAccount from './Authentication/ChooseAccount';
import CreateManagerAccount from './Authentication/ManagerAccount';
import CreateScoutAccount from './Authentication/ScoutAccount';
import ConfirmManager from './Authentication/ConfirmManager';
import ConfirmScout from './Authentication/ConfirmScout';

import Clubs from './Main/Clubs';
import AddStats from './Main/AddStats';
import AddClub from './Main/AddClub';
import Profile from './Main/Profile';
import PlayerProfile from './Main/PlayerProfile';
import Managers from './Main/Managers';
import ClubOutlay from './Main/ClubOutlay';
import Scouts from './Main/Scouts';
import AddPlayer from './Main/AddPlayer';
import DetailedUser from './Main/DetailedUser';
import Feedback from './Main/Feedback';
import About from './Main/About';

import color from '../res/styles/color';
import MyClubPlayers from './Main/MyClubPlayers';
import EditPlayer from './Main/EditPlayer';
import { FilterPlayers } from './Main/FilterPlayers';
import { GoalKeepers } from './Main/GoalKeepers';
import { Defenders } from './Main/Defenders';
import { Midfielders } from './Main/Midfielders';
import { Forwards } from './Main/Forwards';


const Auth = createStackNavigator(
    {
        Login: {
            screen: Login,
            navigationOptions: () => ({headerTitle: "login", ...navConfig})
        },
        CreateAccount: {
            screen: CreateAccount,
            navigationOptions: () => ({headerTitle: "create account", ...navConfig})
        },
        ChooseAccount: {
            screen: ChooseAccount,
            navigationOptions: () => ({headerTitle: "choose account", ...navConfig})
        },
        CreateManagerAccount: {
            screen: CreateManagerAccount,
            navigationOptions: () => ({headerTitle: "create manager account", ...navConfig})
        },
        CreateScoutAccount: {
            screen: CreateScoutAccount,
            navigationOptions: () => ({headerTitle: "create scout account", ...navConfig})
        },
        ConfirmManager: {
            screen: ConfirmManager,
            navigationOptions: () => ({headerTitle: "confirm account", ...navConfig})
        },

        ConfirmScout: {
            screen: ConfirmScout,
            navigationOptions: () => ({headerTitle: "confirm account", ...navConfig})
        },
    },
    {
        mode: 'modal',
        headerMode: 'none',
        headerTransitionPreset: 'fade-in-place',
    }
)


const Main = createStackNavigator(
    {    
        TopBar: {
            screen: TopTab,
            navigationOptions: () => ({headerTitle: "SPORTS SCOUT", ...navConfig})
        },
        About: {
            screen: About,
            navigationOptions: () => ({headerTitle: "about sports scout", ...navConfig})
        },
        Profile: {
            screen: Profile,
            navigationOptions: () => ({headerTitle: "profile", ...navConfig})
        },
        FilterPlayers: {
            screen: FilterPlayers,
            navigationOptions: () => ({headerTitle: "filter players", ...navConfig})
        },
        GoalKeepers: {
            screen: GoalKeepers,
            navigationOptions: () => ({headerTitle: "goal keepers", ...navConfig})
        },
        Defenders: {
            screen: Defenders,
            navigationOptions: () => ({headerTitle: "defenders", ...navConfig})
        },
        Midfielders: {
            screen: Midfielders,
            navigationOptions: () => ({headerTitle: "midfielders", ...navConfig})
        },
        Forwards: {
            screen: Forwards,
            navigationOptions: () => ({headerTitle: "forwards", ...navConfig})
        },
        ClubOutlay: {
            screen: ClubOutlay,
            navigationOptions: () => ({headerTitle: "club", ...navConfig})
        },
        PlayerProfile: {
            screen: PlayerProfile,
            navigationOptions: () => ({...navConfig})
        },
        Managers: {
            screen: Managers,
            navigationOptions: () => ({headerTitle: "managers", ...navConfig})
        },
        Scouts: {
            screen: Scouts,
            navigationOptions: () => ({headerTitle: "scouts", ...navConfig})
        },
        Feedback: {
            screen: Feedback,
            navigationOptions: () => ({headerTitle: "feedack", ...navConfig})
        },
        DetailedUser: {
            screen: DetailedUser,
            navigationOptions: () => ({headerTitle: "details", ...navConfig})
        },
        Clubs: {
            screen: Clubs,
            navigationOptions: () => ({headerTitle: "clubs", ...navConfig})
        },
        AddClub: {
            screen: AddClub,
            navigationOptions: () => ({headerTitle: "add club", ...navConfig})
        },
        AddPlayer: {
            screen:AddPlayer,

            navigationOptions: () => ({headerTitle: "add player", ...navConfig})
        },
        MyClubPlayers: {
            screen:MyClubPlayers,

            navigationOptions: () => ({headerTitle: "my club players", ...navConfig})
        },
        EditPlayer: {
            screen:EditPlayer,

            navigationOptions: () => ({headerTitle: "my club players", ...navConfig})
        },
        AddStats: {
            screen: AddStats,
            navigationOptions: () => ({headerTitle: "add stats", ...navConfig})
        },
    },
    {
        mode: 'modal',
        headerMode: 'float',
        initialRouteName: 'TopBar',
        headerTransitionPreset: 'fade-in-place',
    }
)

const navConfig = {
    headerStyle: {
        backgroundColor: color.armyGreen,
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


export default createAppContainer(createSwitchNavigator(
    {
        AuthLoading: AuthLoading,
        Auth: Auth,
        Main: Main,
    },
    {
        initialRouteName: 'AuthLoading',
    }
))
