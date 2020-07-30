import { SET_CURRENT_USER } from '../actionTypes';
import { apiCall } from '../../services/api';
import { addError, removeError } from './error'

//ACTION CREATORS
export function setCurrentUser(user, isAuthenticated = false) {
	return {
		type: SET_CURRENT_USER,
		isAuthenticated,
		user
	}
}

export function signinOwner(data) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('post', `/api/auth/owner/signin`, { data })
				.then(user => {
					localStorage.setItem('jwtToken', user.token);
					dispatch(setCurrentUser(user, true));
					dispatch(removeError())
					resolve(user); //API call success
				})
				.catch(err => {
					dispatch(addError(err.message));
					reject(err); //API call fails
				});
		})
	}
}

export function signOutUser() {
	return dispatch => {
		dispatch(setCurrentUser({}, false));
	}
}

export function signinMember(data) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('post', `/api/auth/member/signin`, data)
				.then(user => {
					localStorage.setItem('jwtToken', user.token);
					dispatch(setCurrentUser(user, true));
					dispatch(removeError())
					resolve(user); //API call success
				})
				.catch(err => {
					dispatch(addError(err.message));
					reject(err); //API call fails
				});
		})
	}
}

export function signinAdmin(username, password) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('post', `/api/auth/admin/signin`, {
				username,
				password
			})
				.then(admin => {
					localStorage.setItem('jwtToken', admin.token);
					dispatch(setCurrentUser(admin, true));
					dispatch(removeError())
					resolve(admin); //API call success
				})
				.catch(err => {
					dispatch(addError(err.message));
					reject(err); //API call fails
				});
		});
	}
}