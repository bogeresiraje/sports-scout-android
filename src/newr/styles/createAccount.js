import { StyleSheet } from 'react-native';


export default createStyle = StyleSheet.create({
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
    }
})
