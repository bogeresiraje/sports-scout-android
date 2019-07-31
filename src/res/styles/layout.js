import { StyleSheet } from 'react-native';
import color from './color';


export default layout = StyleSheet.create({
    container: {
        width: 'auto',
        padding: 7,
        backgroundColor: color.lightGrey,
    },

    bottomPadContainer: {
        width: 'auto',
        paddingBottom: 7,
    },

    topPadContainer: {
        width: 'auto',
        paddingTop: 7,
    },

    paddlessContainer: {
        width: '100%',
        minHeight: '100%',
        alignContent: 'center',
        backgroundColor: color.lightGrey,
    },

    armyGreenPaddlessContainer: {
        width: '100%',
        alignContent: 'center',
        backgroundColor: color.armyGreen,
    },

    padBottom: {
        height: 50,
        backgroundColor: color.lightGrey,
    },
    padBottomWhite: {
        height: 50,
        backgroundColor: color.white,
    },
    inScrollContainer: {
        width: 'auto',
        alignContent: 'center',
        marginBottom: 50,
    },

    bottomPagePadding: {
        width: '100%',
        height: 100,
    },

    sectionContainer: {
        padding: 7,
        width: '100%',
        alignContent: 'center',
    },

    // for handling multi-column views
    columnSeparator: {
        flexDirection: 'row',
        backgroundColor: color.white,
        width: '100%',
    },
    columnSeparator99: {
        flexDirection: 'row',
        backgroundColor: color.white,
        width: '99%',
    },
    columnSeparatorGrey: {
        flexDirection: 'row',
        marginBottom: 2,
        backgroundColor: color.lightGrey,
        width: '100%',
    },
    columnSeparatorGrey99: {
        flexDirection: 'row',
        marginBottom: 2,
        backgroundColor: color.lightGrey,
        width: '99%',
    },
    column40: {
        width: '40%',
    },
    column45: {
        width: '45%',
    },
    column33: {
        width: '33%',
    },
    column10: {
        width: '10%',
    },
    column20: {
        width: '20%',
    },
    column45Right: {
        width: '45%',
        alignContent: 'flex-end',
    },
    column5: {
        width: '8%',
    },
    column50: {
        width: '50%',
    },
    borderColumn50: {
        width: '50%',
        borderBottomWidth: 0.5,
        borderBottomColor: color.mediumBlack,
    },
    borderColumn100: {
        width: '100%',
        height: 'auto',
        borderWidth: 0.5,
        alignItems: 'center',
        textAlign: 'center',
        borderColor: color.mediumBlack,
    },
    paddedColumn50: {
        width: '50%',
        padding: 7,
        paddingBottom: 0,
    },

    // Custom background
    column20Grey: {
        width: '20%',
        backgroundColor: color.lightGrey,
    },
    column50Grey: {
        width: '50%',
        backgroundColor: color.lightGrey,
    },
    column50ArmyGreen: {
        width: '50%',
        backgroundColor: color.armyGreen,
    },
    column50JustifyArmyGreen: {
        width: '50%',
        backgroundColor: color.armyGreen,
    },
    column80Grey: {
        width: '80%',
        backgroundColor: color.lightGrey,
    },
    column80ArmyGreen: {
        width: '80%',
        backgroundColor: color.armyGreen,
    },
    column20ArmyGreen: {
        width: '20%',
        backgroundColor: color.armyGreen,
    },

    // Non-padded columns
    column30: {
        width: '30%',
    },
    column60: {
        width: '60%',
    },
    column70: {
        width: '70%',
    },
    column80: {
        width: '80%',
    },
    column90: {
        width: '90%',
    },
    column100: {
        width: '100%',
    },
    column40px: {
        width: 35,
    },
    sparse: {
        height: 40,
        width: '100%',
    },
    horizontalScroll60: {
        width: '60%',
    },

    // Fixed column
    column10RoundFixed: {
        width: 30,
        height: 30,
        borderRadius: 17,
        borderWidth: 1,
        overflow: 'hidden',
        borderColor: color.mediumBlack,
    },

    alignCenter: {
        width: '50%',
        height: 200,
        alignSelf: 'center',
        justifyContent: 'center',
    },

    column50Fixed: {
        width: 50,
    },

    //
    column30Bordered: {
        width: '30%',
        borderBottomWidth: 0.5,
        borderBottomColor: color.mediumBlack,
    },

    column70Bordered: {
        width: '70%',
        borderBottomWidth: 0.5,
        borderBottomColor: color.mediumBlack,
    },

    // justifyContent
    column50Justify: {
        width: '50%',
        alignSelf: 'center',
        justifyContent: 'center',
    },

    justifyMaxGrey: {
        padding: 7,
        width: '100%',
        height: '100%',
        backgroundColor: color.lightGrey,
        alignSelf: 'center',
        justifyContent: 'center',
    },

    justifyMaxArmyGreen: {
        padding: 7,
        width: '100%',
        height: '100%',
        backgroundColor: color.armyGreen,
        alignSelf: 'center',
        justifyContent: 'center',
    },

    height300: {
        width: '100%',
        height: 300,
        borderWidth: 0.5,
        borderColor: color.mediumBlack,
    }

})