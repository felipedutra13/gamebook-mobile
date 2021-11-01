const initialState: number = null;

const OptionReducer = (state = initialState, action) => {
    switch (action.type) {
        case "CHANGE_OPTION":
            return action.option;
        default:
            return state
    }
}
export default OptionReducer;