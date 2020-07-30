import React, { Component } from 'react';
import { Provider } from 'react-redux'
import { configureStore } from '../store'
import { BrowserRouter as Router, withRouter } from 'react-router-dom';
import { setCurrentUser } from '../store/actions/auth'
import jwtDecode from 'jwt-decode';
import { connect } from 'react-redux'

// COMPONENTS
import AppRoute from './AppRoute';
import Navbar from './Navbar';

const store = configureStore();

//When page reload, if there's token, then re-authenticate
if (localStorage.jwtToken) {
  try {
    store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken), true));
  }
  catch (err) {
    store.dispatch(setCurrentUser({}))
  }
}
class App extends Component {
  constructor(props){
    super(props);
  }

  render() {
    const currentUser = store.getState().currentUser;
    return (

      <Provider store={store}>
        <Router>
          <React.Fragment>
            <AppRoute />
          </React.Fragment>
        </Router>
      </Provider>
    );
  }
}

export default App;
