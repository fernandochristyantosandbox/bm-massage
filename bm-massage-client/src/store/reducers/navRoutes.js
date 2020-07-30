import { GET_NAVS_BY_ROLE } from '../actionTypes'

const initialState = {
    owner: [{
        name: 'Home',
        id: 'home',
        to: 'home'
    },
    {
        name: 'Member Control',
        id: 'membercontrol',
        to: 'membercontrol'
    },
    {
        name: 'Reporting',
        id: 'reporting',
        to: 'reporting'
    }],
    member: [{
        name: 'Home',
        id: 'home',
        to: 'home'
    },
    {
        name: 'Order History',
        id: 'order_history',
        to: 'orderhistory'
    }],
    admin: [{
        name: 'Home',
        id: 'home',
        to: 'home'
    },
    {
        name: 'Massage Place',
        id: 'massage_place',
        to: 'massageplace'
    }]
}

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_NAVS_BY_ROLE:
            // return state;
            return {[action.role]: [...state[action.role]]}
        default:
            return state;
    }
}