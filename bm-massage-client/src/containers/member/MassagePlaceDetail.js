import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { apiCall } from '../../services/api';
import { addError } from '../../store/actions/error';
import {connect} from 'react-redux'

const OrderConfirmation = props => {
    const { massage, currTime, handleConfirmOrder, handleCancelOrder } = props;
    return (
        <div id="order-confirmation" style={{ marginTop: '1rem' }}>
            <div className="ui secondary segment">
                <h1>Order Confirmation</h1>
                <hr style={{ margin: '0' }} />
                <h5>Massage Type: {massage.massageName} ({massage.massageType.name})</h5>
                <p>Price: {massage.price}</p>
                <section id="personaldata-review" style={{marginBottom: '.5rem'}}>
                    <h4 style={{ color: 'red' }}>
                        <em>This order is valid until 2 hours (From: {currTime}). <br />After 2 hours has passed, your order will be marked as Expired</em>
                    </h4>
                </section>
                <button className="ui violet button" onClick={handleConfirmOrder}>Order</button>
                <button className="ui button" onClick={handleCancelOrder}>Cancel</button>
            </div>
        </div>
    )
}

OrderConfirmation.propTypes = {
    massage: PropTypes.object.isRequired,
    handleCancelOrder: PropTypes.func.isRequired,
    handleConfirmOrder: PropTypes.func.isRequired
}

class MassagePlaceDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            massagePlaceDetail: undefined,
            choosenMassage: undefined,
            currTimeInterval: null,
            currTime: null
        }
    }

    getCurrentOrderCount(massagePlace) {
        if (massagePlace.massages) {
            let orderCount = 0;
            massagePlace.massages.forEach(massage => {
                orderCount += massage.orders.length;
            });
            return orderCount;
        }
    }

    setChoosenMassage(massage) {
        this.setState({ ...this.state, choosenMassage: massage });
    }

    handleConfirmOrder = () => {
        const {choosenMassage} = this.state;
        const {currentUser} = this.props;
        apiCall('post', `/api/order/${currentUser.user.id}/${choosenMassage._id}/insert`)
            .then(res => {
                this.props.history.push('/member/home');
            })
            .catch(err => addError(err.message));
    }

    handleCancelOrder = () => {
        this.setState({...this.state, choosenMassage: undefined})
    }

    mapMassages(massages) {
        const massageTypeWithMassages = {}
        /**
         * massageTypeWithMassages= {
         *   5b5dcc28bce996945279348c: [{massage obj}, {massage obj}] //massagetypeID: [massage obj, massage obj]
         * }
         */
        const massageTypes = []
        /**
         * [{ _id: ..., name: ... },  ]
         */
        massages.forEach(massage => {
            if (massageTypeWithMassages[massage.massageType._id])
                massageTypeWithMassages[massage.massageType._id].push(massage)
            else {
                massageTypes.push({ _id: massage.massageType._id, name: massage.massageType.name });
                massageTypeWithMassages[massage.massageType._id] = new Array;
                massageTypeWithMassages[massage.massageType._id].push(massage)
            }
        });
        return massageTypes.map(massageType => {
            return (
                <div className="ui segment" key={massageType._id}>
                    <h4>{massageType.name}</h4>
                    <ul>
                        {
                            massageTypeWithMassages[massageType._id].map(massage => {
                                return (
                                    <li style={{ paddingLeft: '1rem', marginBottom: '.5rem' }} key={massage._id}>
                                        <a style={{ color: 'royalblue', cursor: 'pointer' }} onClick={() => this.setChoosenMassage(massage)}>
                                            <b>{massage.massageName}</b>
                                        </a>
                                        <div>
                                            <p>Price: {massage.price}</p>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            )
        })
    }

    render() {
        const { massagePlaceDetail, choosenMassage, currTime } = this.state;

        const placeDetail = massagePlaceDetail ?
            (
                <section style={{ padding: '0 .8rem' }}>
                    <div className="ui">
                        <h1>{massagePlaceDetail.placeName}</h1>
                        <p>Address: {massagePlaceDetail.address}</p>
                        <p>Capacity: {this.getCurrentOrderCount(massagePlaceDetail)}/{massagePlaceDetail.capacity}</p>

                        <section id="massages" style={{ marginTop: '2rem' }}>
                            <h3>Choose massage type</h3>
                            <div className="ui segments">
                                {this.mapMassages(massagePlaceDetail.massages)}
                            </div>
                        </section>
                    </div>
                    {choosenMassage &&
                        <OrderConfirmation
                            massage={choosenMassage}
                            currTime={currTime}
                            handleConfirmOrder={this.handleConfirmOrder}
                            handleCancelOrder={this.handleCancelOrder}
                        />}
                </section>
            ) : (
                <div>Loading...</div>
            )

        return (
            placeDetail
        )
    }

    componentDidMount() {
        const { massageplaceid } = this.props.match.params;
        const massagePlaceDetail = apiCall('get', `/api/massageplace/${massageplaceid}/getdetail`)
            .then(res => {
                this.setState({ ...this.state, massagePlaceDetail: res })
            })
            .catch(err => addError(err.message));
        const currTimeInterval = setInterval(() => {
            this.setState({
                currTime: new Date().toLocaleString()
            })
        }, 1000)
        this.setState({...this.state, currTimeInterval: currTimeInterval});
    }

    componentWillUnmount(){
        const {currTimeInterval} = this.state;
        clearInterval(currTimeInterval);
    }
}

MassagePlaceDetail.propTypes = {
    selectedMassagePlace: PropTypes.object.isRequired
}

function mapStateToProps(reduxState){
    return {
        currentUser:  reduxState.currentUser
    }
}

export default connect(mapStateToProps, null)(MassagePlaceDetail);