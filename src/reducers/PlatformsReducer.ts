const initialState: number[] = [6, 167, 169, 130, 48, 49];

const PlatformsReducer = (state = initialState, action) => {
   switch (action.type) {
      // case "ADD_PLATFORM":
      //    return [...state, action.id];
      // case "REMOVE_PLATFORM":
      //    return state.filter(id => id !== action.id);
      case "SET_PLATFORMS":
         return action.ids
      default:
         return state
   }
}
export default PlatformsReducer;