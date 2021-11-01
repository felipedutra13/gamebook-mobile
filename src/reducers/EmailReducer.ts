const initialState: string = "";
import * as SecureStore from 'expo-secure-store';

const EmailReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_EMAIL":
            SecureStore.setItemAsync('email', action.email);
            return action.email;
        default:
            return state;
    }
}
export default EmailReducer;