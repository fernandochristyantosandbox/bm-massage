import React, { Component } from 'react'
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Home from './Home';
import MassagePlaceDetail from './MassagePlaceDetail';

class MemberRoutes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMassagePlace: undefined
    }
  }

  setSelectedMassagePlace = (massagePlace) => {
    this.setState({ ...this.state, selectedMassagePlace: massagePlace })
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
                setSelectedMassagePlace={this.setSelectedMassagePlace}
              />
            )
          }} />

          {this.state.selectedMassagePlace &&
            <Route path={`${match.url}/massageplace/d/:massageplaceid`} render={props => {
              return (
                <MassagePlaceDetail
                  {...props}
                  selectedMassagePlace={this.state.selectedMassagePlace}
                />
              )
            }} />
          }
        </Switch>
      </div>
    )
  }
}

export default withRouter(MemberRoutes);