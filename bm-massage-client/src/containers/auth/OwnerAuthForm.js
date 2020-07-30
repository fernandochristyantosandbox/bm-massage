import React, { Component } from 'react'
import LoginForm from '../../components/forms/LoginForm';
import { apiCall } from '../../services/api';
import {addError} from '../../store/actions/error';
import {connect} from 'react-redux';
import {signinOwner} from '../../store/actions/auth';
import {withRouter} from 'react-router-dom';

class OwnerAuthForm extends Component{
    constructor(props) {
        super(props);
    }

    handleFormSubmit = event => {
        event.preventDefault();

        const {username, password} = this.props;
        const data = {
            username,
            password
        }
        let value = this.props.signinOwner(data)
            .then(res => this.props.history.push('/owner/home'))
            .catch(err => err);
    }

    render() {
        const { handleInputChange } = this.props;
        return (
            <React.Fragment>
                <LoginForm
                    buttonText="Login as Owner"
                    handleInputChange={handleInputChange}
                    handleFormSubmit={this.handleFormSubmit}
                />
            </React.Fragment>
        )
    }
}

export default withRouter(connect(null, {signinOwner, addError})(OwnerAuthForm));