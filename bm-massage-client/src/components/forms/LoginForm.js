import React, { Component } from 'react'
import PropTypes from 'prop-types';

const LoginForm = props => {
    //props func
    const { handleInputChange, handleFormSubmit } = props

    //props elem
    const { buttonText, username, password, isMember } = props

    return (
        <React.Fragment>
            <form className="ui form" onSubmit={handleFormSubmit}>
                <div className="field">
                    <label>Username</label>
                    <input type="text" name="username" placeholder="Username" value={username} onChange={handleInputChange} />
                </div>
                <div className="field">
                    <label>Password</label>
                    <input type="password" name="password" placeholder="Last Name" value={password} onChange={handleInputChange} />
                </div>
                <input className="ui purple button" type="submit" value={buttonText} />
                {(isMember) &&
                    <input className="ui green button" type="submit" value="Register" />
                }
            </form>
        </React.Fragment>
    )
}

LoginForm.propTypes = {
    errorMessage: PropTypes.string,
    handleInputChange: PropTypes.func.isRequired,
    handleFormSubmit: PropTypes.func.isRequired,
    buttonText: PropTypes.string.isRequired,
    isMember: PropTypes.bool
}

export default LoginForm;