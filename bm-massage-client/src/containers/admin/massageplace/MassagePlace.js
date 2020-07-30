import React, { Component } from 'react'
import PropTypes from 'prop-types';
import MassagePlaceRoutes from './MassagePlaceRoutes';

const PartialButtonsNav = props => {
    const { navItems } = props;

    const navItemOnClick = navItem => {
        props.history.push(`/admin/massageplace/${navItem.to}`);
    }

    const mapNavItemsToButtons = () => {
        return navItems.map(navItem => {
            return (
                <button key={navItem.id} className="ui button purple" onClick={() => navItemOnClick(navItem)}>{navItem.name}</button>
            )
        })
    }

    return mapNavItemsToButtons();
}

PartialButtonsNav.propTypes = {
    navItems: PropTypes.array.isRequired
    /**
     * [{
     *    "id": ...,
     *    "name": ...,
     *    "to": ...
     * }, ]
     */
}
class MassagePlace extends Component {
    constructor(props) {
        super(props);

        this.partialNavItems = [{
            "id": "order_logs",
            "name": "Order Logs",
            "to": "orderlogs"
        },
        {
            "id": "member_control",
            "name": "Member Control",
            "to": "membercontrol"
        },
        {
            "id": "massageplace_stats",
            "name": "Massage Place Stats",
            "to": "massageplacestats"
        }]
    }

    render() {
        return (
            <div>
                <section id="buttons-floating-nav">
                    <PartialButtonsNav
                        {...this.props}
                        navItems={this.partialNavItems}
                    />
                    <div style={{marginTop: '20px'}}>
                        <MassagePlaceRoutes 
                        {...this.props}
                        />
                    </div>
                </section>
            </div>
        )
    }
}

export default MassagePlace