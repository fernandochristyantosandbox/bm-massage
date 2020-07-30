import React, { Component } from 'react'
import LoginForm from '../../components/forms/LoginForm';
import {connect} from 'react-redux';
import {signinAdmin} from '../../store/actions/auth'

class AdminAuthForm extends Component {
    constructor(props) {
        super(props);
    }

    handleFormSubmit = event => {
        event.preventDefault();

        const {username, password} = this.props;
        
        this.props.signinAdmin(username, password)
            .then(res => {
                this.props.history.push('/admin/home');
            })
            .catch(err => err);
    }

    render() {
        const { handleInputChange } = this.props;

        return (
            <React.Fragment>
                <LoginForm
                    buttonText="Login as Admin"
                    handleInputChange={handleInputChange}
                    handleFormSubmit={this.handleFormSubmit}
                />
            </React.Fragment>
        )
    }
}

export default connect(null, {signinAdmin})(AdminAuthForm);