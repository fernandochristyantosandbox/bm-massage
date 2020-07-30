import React, { Component } from 'react'
import { apiCall } from '../../services/api';
import DynamicAdminUpdateTable from '../../components/tables/DynamicAdminUpdateTable';
const $ = require('jquery');

class MassagePlaceDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            massagePlaceName: '',
            massagePlace: {
                placeName: '',
                capacity: 0,
                address: ''
            },
            admins: [{
                adminName: '',
                username: '',
                password: '',
                active: true,
                willDelete: false,
                fromAPI: false
            }],
            massages: [],
            updateAdminError: '',
            updatePlaceError: ''
        }
    }

    componentDidMount() {
        const { massageplaceid } = this.props.match.params;
        apiCall('get', `/api/massageplace/${massageplaceid}/getdetail`)
            .then(messagePlaceDetails => {
                this.setState({
                    massagePlaceName: messagePlaceDetails.placeName,
                    massagePlace: {
                        _id: messagePlaceDetails._id,
                        placeName: messagePlaceDetails.placeName,
                        capacity: messagePlaceDetails.capacity,
                        address: messagePlaceDetails.address
                    },
                    admins: messagePlaceDetails.admins.map(admin => ({ ...admin, fromAPI: true })),
                    massages: messagePlaceDetails.massages,
                    massagers: messagePlaceDetails.massagers
                });
            })
            .catch(err => err);
        $("#updateAdminSuccess").hide();
        $("#updatePlaceSuccess").hide();

        const { admins } = this.state;
        const fullFieldAdmins = admins.map(admin => {
            if (!admin.username)
                admin.username = ''
            if (!admin.password)
                admin.password = ''
            if (!admin.active)
                admin.active = false
            return admin;
        });
        this.setState({ ...this.state, admins: fullFieldAdmins });
    }

    handleMassagePlaceDataInputChange = event => {
        this.setState({ ...this.state, massagePlace: { ...this.state.massagePlace, [event.target.name]: event.target.value } });
    }

    handleMassagePlaceFormSubmit = event => {
        event.preventDefault();
        const { massageplaceid } = this.props.match.params;
        apiCall('patch', `/api/massageplace/${massageplaceid}/update`, {
            massagePlace: {
                ...this.state.massagePlace
            }
        })
            .then(res => {
                $("#updatePlaceSuccess").fadeTo(2000, 500).slideUp(500, function () {
                    $("#updatePlaceSuccess").slideUp(500);
                });
            })
            .catch(err => err);
    }

    handleAdminAddClick = event => {
        event.preventDefault();

        const state = this.state;
        this.setState({
            ...state,
            admins: [...state.admins, {
                adminName: '',
                username: '',
                password: '',
                active: true
            }]
        });
    }

    handleRemoveAdmin = (index) => {
        if (!this.state.admins[index].fromAPI) {
            const admins = this.state.admins.filter((admin, i) => i !== index);
            this.setState({ ...this.state, admins });
        }
        else {
            const admins = this.state.admins.map((admin, i) => {
                if (i === index) {
                    admin.willDelete = !admin.willDelete
                    return admin;
                }
                return admin
            });
            this.setState({ ...this.state, admins });
        }
    }

    handleAdminEdit = (event, index) => {
        const admins = [...this.state.admins];
        admins[index][event.currentTarget.name] = event.currentTarget.value;
        this.setState({ ...this.state, admins });
    }

    handleAdminActiveChange = (event, index) => {
        const admins = [...this.state.admins];
        admins[index].active = event.target.checked;
        this.setState({ ...this.state, admins })
    }

    handleAdminFormSubmit = event => {
        event.preventDefault();
        const adminsBeforeUpdate = this.state.admins;
        const { massageplaceid } = this.props.match.params;
        const { admins } = this.state;

        const adminPromises = admins.map((admin, index) => {
            const currAdmin = {
                adminName: admin.adminName,
                username: admin.username,
                password: admin.password,
                active: admin.active ? true : false
            }
            if (admin.fromAPI) {
                if (admin.willDelete) {
                    //Delete
                    return apiCall('delete', `/api/admin/${admin._id}/delete`)
                        .then(res => undefined)
                        .catch(err => err)
                }
                else {
                    //Update
                    return apiCall('post', `/api/admin/${admin._id}/update`, {
                        admin: { ...currAdmin, _id: admin._id }
                    })
                    .then(res => res)
                }
            }
            else {
                //Insert
                return apiCall('post', `/api/massageplace/${massageplaceid}/addadmin`, {
                    admin: { ...currAdmin }
                })
                .then(res => res)
                .catch(err => err);
            }
        });

        Promise.all(adminPromises)
            .then(res => {
                const adminsResult = res.filter(admin => {
                    if(admin !==undefined && admin !== null){
                        return admin;
                    }
                })
                .map(admin => {
                    admin.fromAPI = true;
                    return admin;
                })
                this.setState({...this.state, admins: [...adminsResult]});
                $("#updateAdminSuccess").fadeTo(2000, 500).slideUp(500, function () {
                    $("#updateAdminSuccess").slideUp(500);
                });
            })
            .catch(err => err);
    }
    render() {
        const { match, history, city } = this.props;
        const { placeName, capacity, address } = this.state.massagePlace;
        return (
            <React.Fragment>
                <h1>{this.state.massagePlaceName}</h1>
                <div id="updatePlaceSuccess" className="alert alert-success">
                        Update Success
                    </div>
                <form className="ui form" onSubmit={this.handleMassagePlaceFormSubmit}>
                    <div className="field">
                        <label>Massage Place Name</label>
                        <input type="text" name="placeName" placeholder="A good name for your place" value={placeName} onChange={this.handleMassagePlaceDataInputChange} />
                    </div>
                    <div className="field">
                        <label>Capacity (per day)</label>
                        <input type="number" name="capacity" min="0" value={capacity} onChange={this.handleMassagePlaceDataInputChange} />
                    </div>
                    <div className="field">
                        <label>Address</label>
                        <input type="text" name="address" min="0" value={address} onChange={this.handleMassagePlaceDataInputChange} />
                    </div>
                    <input className="ui green button" type="submit" value="Update" />
                </form>
                <div style={{ width: '55%' }}>
                    <div className="ui horizontal divider">
                        Manage Your Admins Here
                    </div>
                    {this.state.updateAdminError &&
                        <div className="alert alert-danger">
                            {this.state.updateAdminError}
                        </div>
                    }
                    <div className="alert alert-warning">
                        Only admins that have been given a valid username and password can log in.
                    Please assign your admins usernames and passwords as soon as possible <br />
                        Admins that have not been given usernames and passwords are marked <span style={{ color: 'red' }}>red</span>.
                        <br /><br />
                        <span style={{ color: 'red' }}>*</span><strong>  Admin names must not be empty</strong>
                    </div>
                    <div id="updateAdminSuccess" className="alert alert-success">
                        Update Success
                    </div>
                    <form onSubmit={this.handleAdminFormSubmit}>
                        <DynamicAdminUpdateTable
                            title="Manage Admins"
                            data={this.state.admins}
                            onButtonAddClick={this.handleAdminAddClick}
                            onButtonRemoveClick={this.handleRemoveAdmin}
                            handleAdminActiveChange={this.handleAdminActiveChange}
                            handleInputChange={this.handleAdminEdit}
                            thead={['Name *', 'Username', 'Password', 'Active', 'Remove']}
                            tbody={['adminName', 'username', 'password']}
                        />
                        <input className="ui green button" type="submit" value="Update Admins" />
                    </form>
                </div>
            </React.Fragment>
        )
    }
}

export default MassagePlaceDetail;