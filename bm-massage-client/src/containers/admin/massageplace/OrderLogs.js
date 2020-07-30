import React, { Component } from 'react'
import { apiCall } from '../../../services/api'
import { formatDate, convertZone } from '../../../services/date'
import PropTypes from 'prop-types';
import SimpleAccordion from '../../../components/views/SimpleAccordion';

const moment = require('moment');

const OrderLogPanel = props => {
    const mapOrderLogsToAccordions = () => {
        const { orderLogs } = props;

        var prevCreatedAt = '';
        return orderLogs.map(orderLog => {
            const createdAt = formatDate(convertZone(orderLog.createdAt, 'Asia/Bangkok'), 'LL');
            const isSameDateAsBefore = moment(formatDate(createdAt, 'L')).isSame(formatDate(prevCreatedAt, 'L'));
            prevCreatedAt = formatDate(createdAt, 'LL');
            return (
                <div key={orderLog._id}>
                    <div>{!isSameDateAsBefore &&
                        <h3 style={{ marginTop: '10px' }} className="ui block header">
                            <span>{createdAt}</span>
                        </h3>}
                    </div>
                    <div style={{ paddingLeft: '1rem' }}>
                        {!orderLog.isComplete && <span style={{ display: 'block', transform: 'translate(0, 10px)', color: 'red', marginLeft: '20px' }}>Expired</span>}
                       {orderLog.isComplete && <span style={{ display: 'block', transform: 'translate(0, 10px)', color: '#84DA06', marginLeft: '20px' }}>Complete</span>}
                        <SimpleAccordion
                            datas={[{
                                id: orderLog._id,
                                title: `${orderLog._id} (${formatDate(orderLog.createdAt, 'LL HH:mm:ss')}) - ${orderLog.member.email}`,
                                content: [`Member email: ${orderLog.member.email}`,
                                `Member username: ${orderLog.member.username}`,
                                `Member gender: ${orderLog.member.gender}`,
                                `Massage type: ${orderLog.massage.massageType.name}`,
                                `Massage name: ${orderLog.massage.massageName}`,
                                `Price: ${orderLog.massage.price}`
                                ]
                            }]}
                        />
                    </div>
                </div>
            )
        })
    }

    return mapOrderLogsToAccordions();
}
OrderLogPanel.propTypes = {
    orderLogs: PropTypes.array.isRequired
}



class OrderLogs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            orderLogs: []
        }
    }

    render() {
        const { orderLogs } = this.state;

        return (
            <React.Fragment>
                <h1>Order Logs</h1>
                <OrderLogPanel
                    orderLogs={orderLogs}
                />
            </React.Fragment>
        )
    }

    componentDidMount() {
        const { massageplaceid } = this.props;
        apiCall('get', `/api/massageplace/${massageplaceid}/getorderlog`)
            .then(orderLogs => {
                this.setState({ ...this.state, orderLogs: orderLogs });
            })
            .catch(err => err);
    }
}

export default OrderLogs