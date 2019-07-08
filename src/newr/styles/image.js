import { StyleSheet } from 'react-native';
import color from './color';


export default image = StyleSheet.create({
    rectPhoto: {
        height: 250,
        borderWidth: 1,
        borderColor: color.dullBlack,
        width: '100%',
    },
    rectMediumImage: {
        alignSelf: 'center',
        height: 90,
        width: '99%',
        paddingLeft: 7,
        paddingTop: 7,
    },
    icon: {
        height: 24,
        width: 24,
        alignSelf: 'center',
    },
    roundSmallImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    roundMediumImage: {
        width: 50,
        height: 50,
        alignSelf: 'center',
        borderRadius: 25,
    },
})
