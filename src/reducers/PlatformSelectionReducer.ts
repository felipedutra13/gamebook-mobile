const initialState: boolean = false;

const PlatformSelection = (state = initialState, action) => {
    switch (action.type) {
        case "CHANGE_VISIBILITY":
            return action.option;
        default:
            return state
    }
}
export default PlatformSelection;