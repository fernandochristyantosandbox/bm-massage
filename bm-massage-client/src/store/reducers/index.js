import {combineReducers} from 'redux';
import currentUser from './currentUser';
import error from './error';
import navRoutes from './navRoutes';

const rootReducer = combineReducers({
    currentUser,
    error,
    navRoutes
});

export default rootReducer;