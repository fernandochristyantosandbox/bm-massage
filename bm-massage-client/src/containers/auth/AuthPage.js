import React, { Component } from 'react'
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'
import { addError, removeError } from '../../store/actions/error';

//Containers
import AdminAuthForm from './AdminAuthForm';
import MemberAuthForm from './MemberAuthForm';
import OwnerAuthForm from './OwnerAuthForm';

class AuthPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            active: 'Member',
            username: '',
            password: ''
        }
    }

    setLoginPanel(active) {
        this.setState({ ...this.state, active: active })
    }

    setError(errorMessage) {
        this.setState({ ...this.state, error: errorMessage })
    }

    handleInputChange = event => {
        this.setState({ ...this.state, [event.target.name]: event.target.value })
    }

    render() {
        //Redux props
        const { addError, removeError } = this.props;
        const { error } = this.props

        const errorMessage = this.state.error || error.message;
        return (
            <React.Fragment>
                <div className="center padding-top-lg" style={{ width: '60%' }}>
                    <div className="flex">
                        <h1 className="inline-block">Welcome to </h1>
                        <div className="inline-block" style={{ padding: '.8rem .8rem', backgroundColor: '#DDA0DD', margin: '0 .5rem' }}>
                            <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'white' }}>BM</h1>
                        </div>
                        <h1 className="inline-block">Massage</h1>
                    </div>
                    <div className="ui top attached tabular menu">
                        <a className={`item ${this.state.active === 'Member' ? "active" : ""}`} onClick={() => this.setLoginPanel('Member')}>
                            Member
                    </a>
                        <a className={`item ${this.state.active === 'Admin' ? "active" : ""}`} onClick={() => this.setLoginPanel('Admin')}>
                            Admin
                    </a>
                        <a className={`item ${this.state.active === 'Owner' ? "active" : ""}`} onClick={() => this.setLoginPanel('Owner')}>
                            Owner
                    </a>
                    </div>
                    <div className="ui bottom attached segment" style={{ textAlign: 'left' }}>
                        {errorMessage && (
                            <div className="alert alert-danger" role="alert">
                                <p>{errorMessage}</p>
                            </div>
                        )}

                        {this.state.active == 'Member' &&
                            <MemberAuthForm
                                {...this.props}
                                handleInputChange={this.handleInputChange}
                                username={this.state.username}
                                password={this.state.password}
                            />
                        }

                        {this.state.active == 'Admin' &&
                            <AdminAuthForm
                                {...this.props}
                                handleInputChange={this.handleInputChange}
                                username={this.state.username}
                                password={this.state.password}
                            />
                        }

                        {this.state.active == 'Owner' &&
                            <OwnerAuthForm
                                handleInputChange={this.handleInputChange}
                                username={this.state.username}
                                password={this.state.password}
                            />
                        }
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

function mapStateToProps(reduxState) {
    return {
        error: reduxState.error
    }
}

function mapDispatcherToProps() {
    return {
        addError,
        removeError
    }
}

export default withRouter(connect(mapStateToProps, mapDispatcherToProps())(AuthPage))