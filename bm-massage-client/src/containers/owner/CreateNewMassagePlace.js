import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { addError } from '../../store/actions/error';
import { connect } from 'react-redux';
import DynamicInputTable from '../../components/tables/DynamicInputTable';
import { apiCall } from '../../services/api';

class CreateNewMassagePlace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            placeName: '',
            capacity: 0,
            admins: []
        }
    }

    handleFormSubmit = event => {
        event.preventDefault();
        if (this.state.placeName.trim() === '') {
            this.props.addError('Place name must be filled');
        }
        else if (this.capacity < 0) {
            this.props.addError('Capacity must be positive');
        }
        else {
            //submit
            //add new place to city
            apiCall('post', `/api/massageplace/${this.props.cityid}/insert`, {
                placeName: this.state.placeName,
                capacity: this.state.capacity
            })
                .then(res => {
                    //add admins to new place
                    const newPlaceId = res._id;
                    const { admins } = this.state;
                    const insertAdminsPromises = admins.map((admin, index) => {
                        return apiCall('post', `/api/massageplace/${newPlaceId}/addadmin`, {
                            admin: {
                                adminName: admin.adminName,
                                active: true
                            }
                        })
                    });
                    Promise.all(insertAdminsPromises).then(res => {
                        this.props.history.push('/owner/home');
                    })
                        .catch(err => { return err });
                })
                .catch(err => addError(err));
        }
    }

    handleAddNewAdmin = event => {
        event.preventDefault();
        const admins = [...this.state.admins, { adminName: '' }]
        this.setState({ admins });
    }

    handleRemoveNewAdmin = (index) => {
        const admins = this.state.admins.filter((admin, i) => (i !== index));
        this.setState({ admins });
    }

    handleAdminEdit = (event, index) => {
        const admins = [...this.state.admins];
        admins[index].adminName = event.target.value;
        this.setState({ admins });
    }

    handleInputChange = event => {
        this.setState({ ...this.state, [event.currentTarget.name]: event.currentTarget.value });
    }

    render() {
        const { cityid, cityname, error } = this.props;
        const { placeName, capacity, admins } = this.state;

        return (
            <React.Fragment>
                <h2>You are about to create a new massage place in {cityname}</h2>
                <hr />
                {error.message &&
                    <div className="alert alert-danger" role="alert">
                        <p>{error.message}</p>
                    </div>
                }
                <form className="ui form" onSubmit={this.handleFormSubmit}>
                    <div className="field">
                        <label>Massage Place Name</label>
                        <input type="text" name="placeName" placeholder="A good name for your place" value={placeName} onChange={this.handleInputChange} />
                    </div>
                    <div className="field">
                        <label>Capacity (per day)</label>
                        <input type="number" name="capacity" min="0" value={capacity} onChange={this.handleInputChange} />
                    </div>

                    <DynamicInputTable
                        title="Add admins"
                        data={admins}
                        onButtonAddClick={this.handleAddNewAdmin}
                        onButtonRemoveClick={this.handleRemoveNewAdmin}
                        handleInputChange={this.handleAdminEdit}
                        thead="Admins"
                    />

                    <input className="ui button" type="submit" value="Create" />
                </form>
            </React.Fragment>
        )
    }
}

function mapStateToProps(reduxState) {
    return {
        error: reduxState.error
    }
}

CreateNewMassagePlace.propTypes = {
    cityid: PropTypes.string.isRequired,
    cityname: PropTypes.string.isRequired
}

export default withRouter(connect(mapStateToProps, { addError })(CreateNewMassagePlace))