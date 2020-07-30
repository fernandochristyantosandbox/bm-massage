import React, { Component } from 'react'
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AuthPage from './auth/AuthPage';
import Owner from './owner/Owner';
import Member from './member/Member';
import Admin from './admin/Admin';

const AppRoute = props => {
    return (
        <div id="router">
            <Switch>
                <Route exact path="/" render={props => <AuthPage {...props} />} />
                <Route path='/owner' render={props => <Owner {...props} />} />
                <Route path='/member' render={props => <Member {...props} />} />
                <Route path='/admin' render={props => <Admin {...props} />} />
            </Switch>
        </div>
    )
}

function mapStateToProps(reduxState) {
    return {
        currentUser: reduxState.currentUser,
        error: reduxState.error
    }
}

function mapDispatcherToProps() {
    return {

    }
}

export default withRouter(connect(mapStateToProps, mapDispatcherToProps())(AppRoute))