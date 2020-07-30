import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getNavsByRole } from '../store/actions/navRoute';
import { removeError } from '../store/actions/error';
import { signOutUser } from '../store/actions/auth';
import {Link} from 'react-router-dom'

const Navbar = props => {
    const { role, navItems, match } = props;

    const navItemsInstances = navItems.map((navItem, index) => (
        <Link key={navItem.id} to={`${match.url}/${navItem.to}`} className="item" style={{color: 'white'}}>
            {navItem.name}
        </Link>
    ));

    const logout = () => {
        props.signOutUser();
        props.history.push('/');
    }

    return (

        <React.Fragment>
            <div className="ui secondary pointing menu" style={{backgroundColor: '#9370DB'}}>
                {navItemsInstances}
                <div className="right menu">
                    <a className="ui item" style={{color: 'white'}} onClick={logout}>
                        Logout
                    </a>
                </div>
            </div>
        </React.Fragment>
    )
}

Navbar.propTypes = {
    navItems: PropTypes.array.isRequired
}
export default connect(null, { getNavsByRole, removeError, signOutUser })(Navbar);