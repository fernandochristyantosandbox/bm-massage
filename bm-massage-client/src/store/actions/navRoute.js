import { GET_NAVS_BY_ROLE } from '../actionTypes'

//ACTION CREATORS
export const getNavsByRole = role => ({
	type: GET_NAVS_BY_ROLE,
	role
})