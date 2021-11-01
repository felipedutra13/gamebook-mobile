const initialState: number[] = [];

const FilteredPlatformsReducer = (state = initialState, action) => {
   switch (action.type) {
      case "ADD_PLATFORM":
         return [...state, action.id];
      case "REMOVE_PLATFORM":
         return state.filter(id => id !== action.id);
    //   case "SET_PLATFORMS":
    //      return action.ids
      default:
         return state
   }
}
export default FilteredPlatformsReducer;