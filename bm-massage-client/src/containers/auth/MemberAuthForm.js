import React, { Component } from 'react'
import LoginForm from '../../components/forms/LoginForm';
import {connect} from 'react-redux'
import {signinMember} from '../../store/actions/auth';
import {addError} from '../../store/actions/error';


class MemberAuthForm extends Component {
    constructor(props) {
        super(props);
    }

    handleFormSubmit = event => {
        event.preventDefault();

        const {username, password} = this.props;
        
        this.props.signinMember({
            member: {
                username,
                password
            }
        })
            .then(res => {
                this.props.history.push('/member/home');
            })
            .catch(err => err);
    }

    render() {
        const { handleInputChange, username, password } = this.props;

        return (
            <React.Fragment>
                <LoginForm
                    buttonText="Login as Member"
                    handleInputChange={handleInputChange}
                    username={username}
                    password={password}
                    handleFormSubmit={this.handleFormSubmit}
                    isMember={true}
                />
            </React.Fragment>
        )
    }
}

export default connect(null, {signinMember, addError})(MemberAuthForm);