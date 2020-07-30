import React, { Component } from 'react'
import OrderTable from '../../components/tables/OrderTable'
import { apiCall } from '../../services/api';
import { connect } from 'react-redux';
import { addError } from '../../store/actions/error'
import { formatDate, convertZone, addMinutesToDate } from '../../services/date'
import PropTypes from 'prop-types'

const OrderDetailPanel = props => {
    const { order, handleCheckInClick, handlePanelClose } = props;
    return (
        <div className="ui secondary segments" style={{ margin: '4px 10px', padding: '1rem' }}>
            <h1>Order - {order._id}</h1>
            <hr />
            <section id="order-detail" style={{ display: 'flex' }}>
                <div className="col-lg-12 row">
                    <div className="col-lg-5">
                        <p style={{ margin: '0' }}><b>Order ID</b></p>
                        <p>{order._id}</p>
                        <p style={{ margin: '0' }}><b>Massage Type</b></p>
                        <p>{order.massage.massageType.name}</p>
                        <p style={{ margin: '0' }}><b>Massage Name</b></p>
                        <p>{order.massage.massageName}</p>
                        <p style={{ margin: '0' }}><b>Price</b></p>
                        <p>{order.massage.price}</p>
                        <p style={{ margin: '0' }}><b>Order Time</b></p>
                        <p>{formatDate(convertZone(order.createdAt))}</p>
                        <p style={{ margin: '0' }}><b>Expire Time</b></p>
                        <p>{addMinutesToDate(convertZone(order.createdAt), 120)}</p>
                    </div>
                    <div className="col-lg-7">
                        <p style={{ margin: '0' }}><b>Username</b></p>
                        <p>{order.member.username}</p>
                        <p style={{ margin: '0' }}><b>Gender</b></p>
                        <p>{order.member.gender}</p>
                        <p style={{ margin: '0' }}><b>Email</b></p>
                        <p>{order.member.email}</p>
                    </div>
                    <button className="fluid ui button purple" style={{ margin: '10px 0' }} onClick={() => handleCheckInClick(order)}>Check In</button>
                    <button className="fluid ui button gray" onClick={handlePanelClose}>Close</button>
                </div>
            </section>
        </div>
    )
}

OrderDetailPanel.propTypes = {
    order: PropTypes.object.isRequired,
    handlePanelClose: PropTypes.func.isRequired,
    handleCheckInClick: PropTypes.func.isRequired
}



class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ongoingOrders: [],
            currTime: null,
            selectedOrder: undefined,
            query: ''
        }
    }

    handleSearchInput = event => {
        this.setState({...this.state, query: event.currentTarget.value});
    }

    handleOrderDetailClick = (order) => {
        this.setState({ ...this.state, selectedOrder: order });
    }

    handleMarkAsExpiredClick = (order) => {
        const clickedOrderId = order._id;
        const { ongoingOrders } = this.state;
        const ongoingOrdersClone = this.getOrdersClone(ongoingOrders);

        for (let i = 0; i < ongoingOrdersClone.length; i++) {
            if (ongoingOrdersClone[i]._id === clickedOrderId)
                ongoingOrdersClone[i].forceExpire = true;
        }

        this.setState({ ...this.state, ongoingOrders: ongoingOrdersClone });
    }

    getOrdersClone = (orders) => {
        return orders.map(order => {
            const orderClone = { ...order }
            orderClone.member = { ...order.member };
            orderClone.massage = { ...order.massage };
            orderClone.massage.massageType = { ...order.massage.massageType };
            return orderClone;
        });
    }
    handleCheckInClick = (order) => {
        apiCall('patch', `/api/order/${order._id}/makehistory?isComplete=true`)
            .then(res => {
                const { ongoingOrders } = this.state;
                const ongoingOrdersFiltered = ongoingOrders.filter(ongoingOrder => ongoingOrder._id !== order._id);
                this.setState({ ...this.state, ongoingOrders: ongoingOrdersFiltered, selectedOrder: undefined });
            })
            .catch(err => {
                addError(err.message);
            });
    }

    handlePanelClose = () => {
        this.setState({ ...this.state, selectedOrder: undefined });
    }

    markOrderAsExpired = (order) => {

        apiCall('patch', `/api/order/${order._id}/makehistory?isComplete=false`)
            .then(res => {
                const { ongoingOrders } = this.state;
                const ongoingOrdersFiltered = ongoingOrders.filter(ongoingOrder => ongoingOrder._id !== order._id);
                this.setState({ ...this.state, ongoingOrders: ongoingOrdersFiltered });
            })
            .catch(err => {
                addError(err.message);
            });
    }
    cancelMarkOrderAsExpired = (order) => {
        const clickedOrderId = order._id;
        const { ongoingOrders } = this.state;
        const ongoingOrdersClone = this.getOrdersClone(ongoingOrders);

        for (let i = 0; i < ongoingOrdersClone.length; i++) {
            if (ongoingOrdersClone[i]._id === clickedOrderId)
                ongoingOrdersClone[i].forceExpire = false;
        }

        this.setState({ ...this.state, ongoingOrders: ongoingOrdersClone });
    }

    render() {
        const { ongoingOrders, currTime, selectedOrder } = this.state;
        return (
            <React.Fragment>
                <section id="heading">
                    <h1>Admin Panel</h1>
                    <hr />
                    <h3>Current Time - {currTime && formatDate(currTime)}</h3>
                </section>
                <section id="ongoing-orders" style={{ marginTop: '40px' }}>
                    <h2>Ongoing Orders</h2>
                    <div style={{ width: '100%', textAlign: 'right' }}>
                        <div id="search-instructions" className="alert alert-info" style={{ textAlign: 'left' }}>
                            <p style={{ margin: '0' }}><b>Instructions</b></p>
                            <p style={{ margin: '0' }}>Click on <b>Order detail</b> to view order details</p>
                            <p style={{ margin: '0' }}>Click on <b>Check in</b> to check member in</p>
                            <p>Click on <b>Mark as Expire</b> to forcefully mark an order as expired</p>
                            <p style={{ margin: '0' }}>Use the search text box to filter table datas</p>
                            <p style={{ margin: '0' }}>Possible search criterias : </p>
                            <ul>
                                <li>Order ID</li>
                                <li>Massage Type</li>
                                <li>Member's name, username and email</li>
                                <li>Price</li>
                            </ul>
                        </div>
                        <div className="ui input">
                            <input type="text" placeholder="Search..." style={{ width: '30rem' }} />
                        </div>
                    </div>
                    <OrderTable
                        orders={ongoingOrders}
                        handleCheckInClick={this.handleCheckInClick}
                        handleMarkAsExpiredClick={this.handleMarkAsExpiredClick}
                        handleOrderDetailClick={this.handleOrderDetailClick}
                        markOrderAsExpired={this.markOrderAsExpired}
                        cancelMarkOrderAsExpired={this.cancelMarkOrderAsExpired}
                    />
                </section>
                <section id="detail-order">
                    {selectedOrder &&
                        <OrderDetailPanel
                            order={selectedOrder}
                            handleCheckInClick={this.handleCheckInClick}
                            handlePanelClose={this.handlePanelClose}
                        />
                    }
                </section>
            </React.Fragment>
        )
    }

    componentDidMount() {
        //Redux props
        const { massageplaceid } = this.props;

        if (massageplaceid) {
            //fetch ongoing orders
            apiCall('get', `/api/massageplace/${massageplaceid}/getongoingorders`)
                .then(res => {
                    for (let i = 0; i < res.length; i++) {
                        res[i].forceExpire = false;
                    }

                    this.setState({ ...this.state, ongoingOrders: res })
                })
                .catch(err => addError(err.message));

            const currTimeInterval = setInterval(() => {
                this.setState({
                    ...this.state,
                    currTime: new Date().toLocaleString()
                })
            }, 1000)
            this.setState({ ...this.state, currTimeInterval: currTimeInterval });
        }
    }

    componentWillUnmount() {
        const { currTimeInterval } = this.state;
        clearInterval(currTimeInterval);
    }
}

function mapStateToProps(reduxState) {
    return {
        massageplaceid: reduxState.currentUser.user.massageplaceid
    }
}

export default connect(mapStateToProps, null)(Home);