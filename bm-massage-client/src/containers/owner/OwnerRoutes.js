import React, { Component } from 'react'
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Home from './Home';
import Reporting from './Reporting';
import CreateNewMassagePlace from './CreateNewMassagePlace';
import MassagePlaceDetail from './MassagePlaceDetail';
import MemberControl from './MemberControl';

class OwnerRoutes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedCity: null
        }
    }

    setStateSelectedCity = (city) => {
        this.setState({ selectedCity: city })
    }
    render() {
        const { match } = this.props;

        return (
            <div id="router">
                <Switch>
                    <Route path={`${match.url}/home`} render={props => {
                        return (
                            <Home
                                {...props}
                                setStateSelectedCity={this.setStateSelectedCity}
                            />
                        )
                    }} />
                    {this.state.selectedCity &&
                        <Route exact path={`${match.url}/managemassageplaces/createnew`} render={props => {
                            return (
                                <CreateNewMassagePlace
                                    {...props}
                                    cityid={this.state.selectedCity._id}
                                    cityname={this.state.selectedCity.cityName}
                                />
                            )
                        }} />
                    }

                    <Route exact path={`${match.url}/managemassageplaces/v/:massageplaceid`} render={props => {
                        return (
                            <MassagePlaceDetail
                                {...props}
                                city={this.state.selectedCity}
                            />
                        )
                    }} />

                    <Route exact path={`${match.url}/membercontrol`} render={props => {
                        return (
                            <MemberControl
                                {...props}
                                {...this.props}
                            />
                        )
                    }} />
                    <Route exact path={`${match.url}/reporting`} component={Reporting} />
                </Switch>
            </div>
        )
    }
}

export default OwnerRoutes;