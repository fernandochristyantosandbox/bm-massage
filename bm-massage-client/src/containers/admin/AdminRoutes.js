import React, { Component } from 'react'
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Home from './Home';
import MassagePlace from './massageplace/MassagePlace';

class AdminRoutes extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { match } = this.props;
        return (
            <div id="router">
                <Switch>
                    <Route path={`${match.url}/home`} render={props => {
                        return (
                            <Home
                                {...this.props}
                                {...props}
                            />
                        )
                    }} />
                    <Route path={`${match.url}/massageplace`} render={props => {
                        return (
                            <MassagePlace
                                {...this.props}
                                {...props}
                            />
                        )
                    }} />
                </Switch>
            </div>
        )
    }
}

export default withRouter(AdminRoutes);