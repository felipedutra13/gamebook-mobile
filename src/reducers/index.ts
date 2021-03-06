import PlatformsReducer from './PlatformsReducer';
import TabReducer from './TabReducer';
import { combineReducers } from 'redux';
import OptionReducer from './OptionReducer';
import PlatformSelection from './PlatformSelectionReducer';
import AuthReducer from './AuthReducer';
import FilteredPlatformsReducer from './FilteredPlatformsReducer';
import EmailReducer from './EmailReducer';
import PlaylistOptionReducer from './PlaylistOptionReducer';
import GamesTotalReducer from './GamesTotalReducer';

const Reducers = combineReducers({
  platformsState: PlatformsReducer,
  tabState: TabReducer,
  optionState: OptionReducer,
  PlatformSelectionState: PlatformSelection,
  authState: AuthReducer,
  emailState: EmailReducer,
  filteredPlatformsState: FilteredPlatformsReducer,
  playlistState: PlaylistOptionReducer,
  gamesTotalState: GamesTotalReducer
});

export default Reducers;

export type RootState = ReturnType<typeof Reducers>;