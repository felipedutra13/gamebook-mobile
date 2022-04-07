const initialState: number = 0;

const GamesTotalReducer = (state = initialState, action) => {
   switch (action.type) {
      case "SET_GAMES_TOTAL":
         return action.value;
      default:
         return state
   }
}
export default GamesTotalReducer;