import React, { Component } from 'react'
import { withRouter, Switch, Route } from 'react-router-dom';
import MassagePlaceStats from './MassagePlaceStats';
import MemberControl from './MemberControl';
import OrderLogs from './OrderLogs';
import {connect} from 'react-redux';

class MassagePlaceRoutes extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { match } = this.props;
        return (
            <div id="router">
                <Switch>
                    <Route path={`${match.url}/orderlogs`} render={props => {
                        return (
                            <OrderLogs
                                {...props}
                                {...this.props}
                            />
                        )
                    }} />

                    <Route path={`${match.url}/membercontrol`} render={props => {
                        return (
                            <MemberControl
                                {...props}
                                {...this.props}
                            />
                        )
                    }} />

                    <Route path={`${match.url}/massageplacestats`} render={props => {
                        return (
                            <MassagePlaceStats
                                {...props}
                            />
                        )
                    }} />
                </Switch>
            </div>
        )
    }
}

function mapStateToProps(reduxState){
    return {
        massageplaceid: reduxState.currentUser.user.massageplaceid,
        currentUser: reduxState.currentUser
    }
}

export default withRouter(connect(mapStateToProps, null)(MassagePlaceRoutes))