import { AsyncStorage } from 'react-native';

export default class Store {
    static setCredentials = async (credentials) => {
        try {
            await AsyncStorage.setItem('user_object', JSON.stringify(credentials));
            return 1;
        } catch (err) {
            // alert(err)
            return 0;
        }
    } 

    static getCredentials = async () => {
        try {
            const value = await AsyncStorage.getItem('user_object');
            if(value != null) {
                return value;
            } else {
                return 0;
            }
        } catch(error) {
            return 0;
        }
    }

    static deleteCredentials = async () => {
        try {
            await AsyncStorage.removeItem('user_object');
            return 1;
        } catch(error) {
            return 0;
        }
    }
}
