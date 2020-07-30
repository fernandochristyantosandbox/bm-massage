import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { convertZone, formatDate, addMinutesToDate } from '../../services/date'

const OrderTable = props => {
    const { orders, 
        handleCheckInClick, 
        handleMarkAsExpiredClick, 
        handleOrderDetailClick, 
        markOrderAsExpired, 
        cancelMarkOrderAsExpired } = props;

    const mapDatasToRows = (orders) => {
        return orders.map(order => {
            return (
                <tr key={order._id}>
                    <td style={{ textAlign: 'center' }}>{order._id}</td>
                    <td style={{ textAlign: 'center' }}>{order.massage.massageType.name}</td>
                    <td style={{ textAlign: 'center' }}>{order.member.username}</td>
                    <td style={{ textAlign: 'center' }}>{order.massage.price}</td>
                    <td style={{ textAlign: 'center' }}>{formatDate(convertZone(order.createdAt))}</td>
                    <td style={{ textAlign: 'center' }}>{addMinutesToDate(convertZone(order.createdAt), 120)}</td>
                    <td style={{ textAlign: 'center' }}>
                        <button className="ui full-width button gray" onClick={() => handleOrderDetailClick(order)}>Order Detail</button>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                        <button className="ui full-width button purple" onClick={() => handleCheckInClick(order)}>Check in</button>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                        {order.forceExpire &&
                            <React.Fragment>
                                <button className="ui button negative" style={{ marginRight: '10px' }} onClick={() => markOrderAsExpired(order)}>
                                    Expire Order
                                </button>
                                <button className="ui button gray" onClick={() => cancelMarkOrderAsExpired(order)}>Cancel</button>
                            </React.Fragment>
                        }
                        {!order.forceExpire &&
                            <button className="ui full-width button negative" onClick={() => handleMarkAsExpiredClick(order)}>
                                Mark as Expired
                            </button>
                        }
                    </td>
                </tr>
            )
        })
    }

    return (
        <table className="ui striped celled compact table">
            <thead>
                <tr>
                    <th style={{ textAlign: 'center' }}>OrderID</th>
                    <th style={{ textAlign: 'center' }}>Massage Type</th>
                    <th style={{ textAlign: 'center' }}>Username</th>
                    <th style={{ textAlign: 'center' }}>Price</th>
                    <th style={{ textAlign: 'center' }}>Order Time</th>
                    <th style={{ textAlign: 'center' }}>Expire Time</th>
                    <th colSpan={3} style={{ textAlign: 'center' }}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {mapDatasToRows(orders)}
            </tbody>
        </table>
    )
}

OrderTable.propTypes = {
    orders: PropTypes.array.isRequired,
    handleOrderDetailClick: PropTypes.func.isRequired,
    handleMarkAsExpiredClick: PropTypes.func.isRequired,
    handleCheckInClick: PropTypes.func.isRequired,
    markOrderAsExpired: PropTypes.func.isRequired,
    cancelMarkOrderAsExpired: PropTypes.func.isRequired
}

export default OrderTable;