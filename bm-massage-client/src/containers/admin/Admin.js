import React, { Component } from 'react';
import { connect } from 'react-redux'

import { Route, Switch } from 'react-router-dom';
import Navbar from '../Navbar';
import AdminRoutes from './AdminRoutes';
import {addError} from '../../store/actions/error';
class Admin extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { match } = this.props;
        const { navRoutes } = this.props;
        return (
            <React.Fragment>
                <Navbar
                    navItems={navRoutes.admin}
                    {...this.props}
                />
                <div className="ui segment">
                    <AdminRoutes 
                        {...this.props}
                    />
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(reduxState) {
    return {
        currentUser: reduxState.currentUser,
        navRoutes: reduxState.navRoutes,
        error: reduxState.error
    }
}

export default connect(mapStateToProps, {addError})(Admin);
