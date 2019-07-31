import { StyleSheet } from 'react-native';
import color from './color';


const cards = StyleSheet.create({
    profileCard: {
        height: 'auto',
        width: '100%',
        marginBottom: 15,
        borderWidth: 1,
        borderRadius: 5,
        padding: 7,
        borderColor: color.mediumBlack,
        backgroundColor: color.white,
        paddingTop: 8,
        elevation: 1,
    },
    card: {
        height: 'auto',
        width: '100%',
        marginBottom: 15,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: color.mediumBlack,
        padding: 7,
        elevation: 1,
        zIndex: 5,
        backgroundColor: color.white,
    },

    fixedMediumCard: {
        height: 'auto',
        width: '100%',
        marginBottom: 15,
        borderWidth: 1,
        borderRadius: 5,
        padding: 7,
        borderColor: color.mediumBlack,
        backgroundColor: color.white,
        elevation: 1,
    },

    rectCard: {
        height: 'auto',
        width: '100%',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: color.mediumBlack,
        padding: 7,
        elevation: 1,
        backgroundColor: color.white,
    },
    profileTitle: {
        fontWeight: 'bold',
        color: '#555',
        padding: 1,
    },
    twoColumn: {
        flexDirection: 'row',
        elevation: 5,
        zIndex: 1,
    },
    text: {
        color: color.black,
    },
    column: {
        width: '50%',
    },
})

export default cards;
