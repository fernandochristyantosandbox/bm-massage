import { ADD_ERROR, REMOVE_ERROR } from '../actionTypes'

const initialState = {
    message: null
}

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_ERROR:
            return { ...state, message: action.message }
        case REMOVE_ERROR:
            return { ...state, message: null }
        default : 
            return state;
    }
}