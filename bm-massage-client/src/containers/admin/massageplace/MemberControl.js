import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { apiCall } from '../../../services/api';
const $ = require('jquery');

const BanPanel = props => {
    const { member, banReason, handleInputChange, handleBan, closeBanPanel } = props;
    return (
        <div className="segment ui">
            <h1>Ban Request for member</h1>
            <p>Username: {member.username}</p>
            <p>Email: {member.email}</p>
            <div className="ui form" style={{ marginBottom: '10px' }}>
                <div className="field">
                    <label>Ban Reason</label>
                    <textarea value={banReason} onChange={handleInputChange} rows={4} name='banReason' rows="2"></textarea>
                </div>
            </div>
            <button onClick={() => handleBan(member)} className="ui button negative">Create ban request</button>
            <button onClick={closeBanPanel} className="ui button">Cancel</button>
        </div>
    )
}
BanPanel.propTypes = {
    member: PropTypes.object.isRequired,
    handleBan: PropTypes.func.isRequired,
    banReason: PropTypes.string.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    closeBanPanel: PropTypes.func.isRequired
}

const MemberControlTable = props => {
    const mapCustomersToRows = () => {
        const { members, openBanPanel } = props;

        const memberIds = Object.keys(members);
        return memberIds.map(memberID => {
            const memberData = members[memberID];
            let banButtonText = ""

            if (memberData.hasActiveBan)
                banButtonText = "Banned"
            else if (memberData.hasBanRequest)
                banButtonText = "Pending"
            else
                banButtonText = "Ban"

            const addedBanClass = (memberData.hasActiveBan || memberData.hasBanRequest) && "disabled";

            const warningStyle = ((memberData.expired > memberData.completed) && { backgroundColor: '#FFCCCC' }) || {};
            return (
                <tr style={warningStyle} key={memberID}>
                    <td style={{ verticalAlign: 'middle' }}>{memberData.username}</td>
                    <td style={{ verticalAlign: 'middle' }}>{memberData.email}</td>
                    <td style={{ verticalAlign: 'middle' }}>{memberData.expired}</td>
                    <td style={{ verticalAlign: 'middle' }}>{memberData.completed}</td>
                    <td style={{ verticalAlign: 'middle' }}>{(memberData.expired > memberData.completed) &&
                        <button
                            className={`ui button negative fluid ${addedBanClass}`}
                            onClick={() => openBanPanel(memberData)}>
                            {banButtonText}
                        </button>
                    }
                    </td>
                </tr>
            )
        })
    }

    return (
        <table className="ui celled table">
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Expired Orders</th>
                    <th>Completed Orders</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {mapCustomersToRows()}
            </tbody>
        </table>
    )
}

MemberControlTable.propTypes = {
    members: PropTypes.object.isRequired,
    /**
     * {
     *   memberid: {
     *     expired: ,
     *     completed: ,
     *     _id: ,
     *     email: ,
     *     gender: ,
     *     username: ,
     *   },
     * }
     */
    openBanPanel: PropTypes.func.isRequired
}

class MemberControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            members: {},
            selectedMemberForBan: undefined,
            banReason: ''
        }
    }

    render() {
        const { members, selectedMemberForBan, banReason } = this.state;
        const { error } = this.props;
        return (
            <div>
                <h1>Member Control</h1>
                <hr />
                <MemberControlTable
                    members={members}
                    openBanPanel={this.openBanPanel}
                />
                <div id="banRequestCreatedSuccess" className="alert alert-success">
                    Ban Request Created
                </div>
                {error.message &&
                    <div id="errorMessage" className="alert alert-danger">
                        {error.message}
                    </div>
                }
                {selectedMemberForBan &&
                    <BanPanel
                        handleBan={this.handleBan}
                        handleInputChange={this.handleInputChange}
                        banReason={banReason}
                        member={selectedMemberForBan}
                        closeBanPanel={this.closeBanPanel}
                    />
                }
            </div>
        )
    }

    handleBan = (member) => {
        //TODO, BAN MEMBER
        const { currentUser, massageplaceid } = this.props;
        const { banReason } = this.state;

        apiCall('post', `/api/ban`, {
            memberid: member._id,
            requestedBy: currentUser.user.id,
            massagePlace: massageplaceid,
            reason: banReason
        }).then(res => {
            $("#banRequestCreatedSuccess").fadeTo(2000, 500).slideUp(500, function () {
                $("#banRequestCreatedSuccess").slideUp(500);
            });
            this.setState({...this.state, selectedMemberForBan: undefined});
        }).catch(err => {
            this.props.addError(err.message);
            $("#errorMessage").fadeTo(2000, 500).slideUp(500, function () {
                $("#errorMessage").slideUp(500);
            });
        });
    }

    openBanPanel = (member) => {
        this.setState({ ...this.state, selectedMemberForBan: member });
    }

    closeBanPanel = () => {
        this.setState({ ...this.state, selectedMemberForBan: undefined });
    }

    handleInputChange = event => {
        this.setState({ ...this.state, [event.currentTarget.name]: event.currentTarget.value })
    }

    componentDidMount() {
        const { massageplaceid } = this.props;
        apiCall('get', `/api/massageplace/${massageplaceid}/getmembercontrols`)
            .then(members => {
                this.setState({ ...this.state, members: members })
            })
            .catch(err => err);

        $("#banRequestCreatedSuccess").hide();
        $("#errorMessage").hide();
    }
}

export default MemberControl