const initialState: number = null;

const PlaylistOptionReducer = (state = initialState, action) => {
    switch (action.type) {
        case "CHANGE_PLAYLIST_OPTION":
            return action.option;
        default:
            return state
    }
}
export default PlaylistOptionReducer;