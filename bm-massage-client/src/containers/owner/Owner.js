import React, { Component } from 'react';
import { connect } from 'react-redux'

import { Route, Switch } from 'react-router-dom';
import Navbar from '../Navbar';
import OwnerRoutes from './OwnerRoutes';
class Owner extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { match } = this.props;
        const { navRoutes } = this.props;
        return (
            <React.Fragment>
                <Navbar
                    navItems={navRoutes.owner}
                    {...this.props}
                />
                <div className="ui segment">
                    <OwnerRoutes 
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
        navRoutes: reduxState.navRoutes
    }
}

export default connect(mapStateToProps, null)(Owner);
