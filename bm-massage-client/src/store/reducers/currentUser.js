import { SET_CURRENT_USER } from '../actionTypes'

const initialState = {
    isAuthenticated: false,
    user: {
        id: null,
        username: null,
        email: null,
        role: null,
        token: null,
        massageplaceid: null //Admin's massage place id (if login is not admin then null)
    }
}

export default (state=initialState, action) => {
    switch(action.type){
        case SET_CURRENT_USER:
            return {
                isAuthenticated: action.isAuthenticated,
                user: action.user
            };
        default:
            return state;
    }
}