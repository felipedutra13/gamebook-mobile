const initialState = "Home";

const TabReducer = (state = initialState, action) => {
    switch (action.type) {
        case "CHANGE_TAB":
            return action.tab;
        default:
            return state
    }
}
export default TabReducer;