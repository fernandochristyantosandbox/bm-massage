import React, { Component } from 'react'
import { connect } from 'react-redux'

export default function withAuth(ComponentToBeRendered) {
	class Authenticate extends Component {
		componentWillMount() {
			//Makes sure the user is still authenticated on component mount
			if (this.props.isAuthenticated === false) {
				this.props.history.push('/');
			}
		}

		componentWillUpdate(nextProps) {
			//makes sure user is still authenticated on component state change
			if (nextProps.isAuthenticated === false) {
				this.props.history.push('/');
			}
		}

		render() {
			return <ComponentToBeRendered {...this.props} />
		}
	}

	function mapStateToProps(reduxState) {
		return {
			isAuthenticated: reduxState.currentUser.isAuthenticated
		}
	}

	return connect(mapStateToProps, null)(Authenticate);
}