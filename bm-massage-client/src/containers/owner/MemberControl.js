import React, { Component } from 'react'
import { apiCall } from '../../services/api';
import PropTypes from 'prop-types';
import SimpleAccordion from '../../components/views/SimpleAccordion';
import { convertZone, formatDate } from '../../services/date';

const $ = require('jquery')

class MemberControl extends Component {
    constructor(props) {
        super(props);

        this.state = {
            banRequests: [],
            selectedBanRequest: undefined,
            alertMessage: ''
        }
    }

    mapBanRequestsDataToAccordions = () => {
        const { banRequests } = this.state;
        return banRequests.map(banRequest => {
            return {
                id: banRequest._id,
                title: `Ban Request for ${banRequest.member.username} by ${banRequest.requestedBy.adminName} -- [${banRequest.requestedBy.massagePlace.city.cityName} - ${banRequest.requestedBy.massagePlace.placeName}]`,
                content: [
                    `Reason: ${banRequest.reason}`,
                    `!!Requested on ${formatDate(convertZone(banRequest.createdAt))}`
                ],
                buttonText: 'Ban Member',
                buttonHandler: this.showBanConfirmationPanel.bind(this, banRequest._id),
                buttonClass: 'button negative ui',
                buttonText2: 'Decline Ban Request',
                buttonHandler2: this.declineBanRequest.bind(this, banRequest._id),
                buttonClass2: 'button  ui'
            }
        });
    }

    showBanConfirmationPanel = (banId) => {
        const { banRequests } = this.state;

        // sets selected ban request
        const selectedBanRequest = banRequests.filter(banRequest => banRequest._id === banId);
        if (selectedBanRequest.length > 0) { //Filter returns an array so...
            this.setState({ ...this.state, selectedBanRequest: selectedBanRequest[0] })
        }
    }

    declineBanRequest = (banId) => {
        const { banRequests } = this.state;

        // sets selected ban request
        const pendingRequests = banRequests.filter(banRequest => banRequest._id !== banId);
        apiCall('post', `/api/ban/${banId}/revokeban`)
            .then(res => {
                this.setState({...this.state, banRequests: pendingRequests});
            })
            .catch(err => err);
    }

    banHandler = (banId) => {
        apiCall('post', `/api/ban/${banId}/banmember`)
            .then(ban => {
                const nonRevokedBans = this.state.banRequests.filter(banRequest => banRequest._id !== banId);
                this.setState({ ...this.state, banRequests: nonRevokedBans, alertMessage: 'Member banned', selectedBanRequest: undefined });
                $("#banAlert").fadeTo(2000, 500).slideUp(500, function () {
                    $("#banAlert").slideUp(500);
                });
            })
            .catch(err => {

            });
    }

    banRevokeHandler = (banId) => {
        apiCall('post', `/api/ban/${banId}/revokeban`)
            .then(revokedBan => {
                const nonRevokedBans = this.state.banRequests.filter(banRequest => banRequest._id !== banId);
                this.setState({ ...this.state, banRequests: nonRevokedBans, alertMessage: 'Ban Revoke Success', selectedBanRequest: undefined });
                $("#banAlert").fadeTo(2000, 500).slideUp(500, function () {
                    $("#banAlert").slideUp(500);
                });
            })
            .catch(err => {

            });
    }

    hideBanConfirmationPanel = () => {
        this.setState({ ...this.state, selectedBanRequest: undefined })
    }

    render() {
        const { banRequests, selectedBanRequest, alertMessage } = this.state;

        return (
            <React.Fragment>
                <section id="section-header">
                    <h1></h1>
                </section>
                <section id="section-requests">
                    <h1>Ban Requests</h1>
                    {banRequests.length > 0 &&
                        <SimpleAccordion
                            datas={this.mapBanRequestsDataToAccordions()}
                        />}
                </section>
                <section id="section-ban-confirmation" style={{ marginTop: '2rem' }}>
                    <div id="banAlert" className="alert alert-success">
                        {alertMessage}
                    </div>
                    {selectedBanRequest &&
                        <div className="ui segment">
                            <h1>Ban Confirmation</h1>
                            <div>
                                <h3>You are about to accept a ban request, details: </h3>
                                <ul>
                                    <li>To be banned member : {selectedBanRequest.member.username}</li>
                                    <li>Admin : {selectedBanRequest.requestedBy.adminName}</li>
                                    <li>City : {selectedBanRequest.requestedBy.massagePlace.city.cityName}</li>
                                    <li>Massage Place Name : {selectedBanRequest.requestedBy.massagePlace.placeName}</li>
                                    <li>Reason for ban : {selectedBanRequest.reason}</li>
                                </ul>
                                <h4>If you agree to ban this member, this member will not be able to login for the next 3 hours</h4>
                            </div>
                            <button className="ui button fluid negative" style={{ margin: '.5rem 0' }}
                                onClick={() => this.banHandler(selectedBanRequest._id)}
                            >
                                Ban
                            </button>
                            <button className="ui button fluid green" style={{ marginBottom: '.5rem' }}
                                onClick={() => this.banRevokeHandler(selectedBanRequest._id)}
                            >
                                Revoke Ban
                            </button>
                            <button className="ui button fluid" onClick={this.hideBanConfirmationPanel}>Cancel</button>
                        </div>
                    }
                </section>
            </React.Fragment>
        )
    }

    componentDidMount() {
        // Get ban requests from API
        apiCall('get', `/api/ban/getbanrequests`)
            .then(banRequests => {
                this.setState({ ...this.state, banRequests: banRequests })
            })
            .catch(err => err);

        $("#banAlert").hide();
    }
}

export default MemberControl;