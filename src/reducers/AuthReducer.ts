const initialState: string = "";
import * as SecureStore from 'expo-secure-store';

const AuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case "AUTH":
            SecureStore.setItemAsync('token', action.token);
            return action.token;
        case "LOGOUT":
            SecureStore.setItemAsync('token', ''); 
            return null;
        default:
            return state;
    }
}
export default AuthReducer;