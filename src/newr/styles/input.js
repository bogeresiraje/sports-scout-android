import { StyleSheet } from 'react-native';
import color from './color';


export default inputStyles = StyleSheet.create({
    label: {
        color: '#555',
        paddingTop: 20,
        paddingBottom: 5,
        textAlign: 'center',
    },

    inputPicker: {
        height: 50,
        width: 100,
        color: '#555',
        paddingTop: 20,
        paddingBottom: 5,
        textAlign: 'center',
    },

    picker: {
        height: 42,
        width: '100%',
        color: '#555',
        backgroundColor: color.white,
        paddingTop: 10,
        paddingBottom: 5,
        alignItems: 'center',
    },

    inputText: {
        height: 40,
        width: '100%',
        borderWidth: 1,
        backgroundColor: color.white,
        borderColor: '#aaa',
        textAlign: 'center',
        marginBottom: 10,
    },

    inputTextArea: {
        height: 200,
        width: '100%',
        backgroundColor: color.white,
        borderWidth: 0.8,
        borderColor: color.mediumBlack,
    },

    greenLabel: {
        color: 'green',
    },

    headerLabel: {
        paddingBottom: 20,
    },

    footerLabel: {
        alignItems: 'center',
    },

    loader: {
        width: '100%',
        height: 40,
        backgroundColor: '#888AFF',
        marginTop: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },

    creatingText: {
        color: '#fff',
        padding: 5,
        alignItems: 'flex-end',
        paddingLeft: '40%',
    },

    indicator: {
        alignItems: 'flex-start',
    },

    creatingtextContainer: {
        alignItems: 'flex-end',
        width: 150,
    },
    
    blueText: {
        color: '#888AFF',
        padding: 15,
    },
    centeredContent: {
        paddingTop: 20,
        alignItems: 'center',
    },
    autoContent: {
        paddingTop: '40%',
        alignItems: 'center',
    },
    postButton: {
        width: '100%',
        height: 30,
        borderWidth: 1,
        borderColor: color.mediumBlack,
        margin: 'auto',
        elevation: 1,
        marginBottom: 5,
        borderRadius: 5,
        alignItems: 'center',
        backgroundColor: color.white,
    },
    postText: {
        color: color.mediumBlack,
        padding: 3,
    },
    textInput: {
        height: 40,
        width: '100%',
        borderWidth: 1,
        borderColor: color.mediumBlack,
    },
    replySendButton: {
        height: 40,
        width: '100%',
        borderWidth: 1,
        borderColor: color.mediumBlack,
        backgroundColor: color.mediumBlack,
        alignItems: 'center',
    },
    replySendButtonText: {
        color: 'white',
        textAlign: 'center',
        marginTop: 6,
    },
    blackTextBtn: {
        color: color.mediumBlack,
        borderTopWidth: 0.5,
        borderTopColor: '#aaa',
        padding: 10,
        paddingLeft: 0,
    },
    blackTextBold: {
        color: '#333',
        fontWeight: 'bold',
        paddingBottom: 4,
        paddingTop: 4,
        textAlign: 'center',
    },
    dullBlackText: {
        borderTopWidth: 0.5,
        borderTopColor: color.mediumBlack,
        paddingBottom: 4,
        paddingTop: 4,
        textAlign: 'center',
    },
    leftBlackTextBold: {
        color: '#333',
        fontWeight: 'bold',
        paddingBottom: 4,
        paddingTop: 4,
    },
    leftDullBlackText: {
        borderTopWidth: 0.5,
        borderTopColor: color.mediumBlack,
        paddingBottom: 4,
        paddingTop: 4,
    },
    boldBlackText: {
        fontWeight: 'bold',
        textAlign: 'center',
        borderTopWidth: 0.5,
        color: '#333',
        borderTopColor: color.mediumBlack,
        paddingBottom: 4,
        paddingTop: 4,
    },
    leftWhiteText: {
        paddingBottom: 4,
        paddingTop: 4,
        backgroundColor: color.mediumBlack,
        color: color.white,
    },
    rightBlackTextBold: {
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'right',
        paddingBottom: 7,
    },
    dullBlackTextBold: {
        fontWeight: 'bold',
        paddingBottom: 10,
    },
})
