import React, { Component } from 'react'
import { apiCall } from '../../services/api';
import Card from '../../components/views/Card';
import { addError } from '../../store/actions/error';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import SimpleAccordion from './../../components/views/SimpleAccordion';
import {convertZone, formatDate, addMinutesToDate} from '../../services/date';

const OngoingOrders = props => {
    const { ongoingOrders } = props;
    const accordionDatas = ongoingOrders.map(order => {
        const createdAt = order.createdAt;
        const expireAt = formatDate(convertZone(createdAt));
        return {
            id: order._id,
            title: `Order ID: ${order._id}`,
            content: [
                `Massage: ${order.massage.massageName}`,
                `Massage Place: ${order.massage.massagePlace.placeName}`,
                `City: ${order.massage.massagePlace.city.cityName}`,
                `Address: ${order.massage.massagePlace.address}`,
                `!!Will expire on ${addMinutesToDate(expireAt, 120)}`
            ]
        }
    });
    return (
        <div className="ui violet segment">
            <h2>Ongoing Orders</h2>
            <section id="ongoing-orders" style={{ paddingLeft: '1.5rem' }}>
                <SimpleAccordion
                    datas={accordionDatas}
                />
            </section>
        </div>
    )
}

OngoingOrders.propTypes = {
    ongoingOrders: PropTypes.array.isRequired
}

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            constMassagePlaces: [],
            massagePlaces: [],
            cities: [],
            searchInput: '',
            selectedMassagePlace: {},
            ongoingOrders: undefined,
            currTime: undefined
        }
    }

    handleCityCheckBoxFilterChange = event => {
        const { cities } = this.state;
        const citiesClone = [...cities].map(city => {
            city.massagePlaces = [...city.massagePlaces]
            return city;
        })
        citiesClone.forEach((city, index) => {
            if (city._id === event.target.name)
                city.isChecked = event.target.checked;
        });
        this.setState({ ...this.state, cities: citiesClone });

        //Filter state.massagePlaces
        const { constMassagePlaces } = this.state;
        const checkedCityIds = this.state.cities.map(city => {
            if (city.isChecked)
                return city._id;
        });
        const filteredMassagePlaces = constMassagePlaces.filter((massagePlace, index) => {
            if (checkedCityIds.indexOf(massagePlace.city._id) !== -1)
                return massagePlace;
        });
        this.setState({ ...this.state, massagePlaces: filteredMassagePlaces });
    }

    handleSearchInputChange = event => {
        const searchQuery = event.target.value;

        //Filter state.massagePlaces
        const { constMassagePlaces } = this.state;
        const filteredMassagePlaces = constMassagePlaces.filter(massagePlace => {
            if (massagePlace.placeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                massagePlace.city.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                massagePlace.address.toLowerCase().includes(searchQuery.toLowerCase())) {
                return massagePlace;
            }
        });
        this.setState({ ...this.state, searchInput: searchQuery, massagePlaces: filteredMassagePlaces });
    }

    massagePlaceClicked = massageplaceid => {
        const selectedMassagePlace = this.state.constMassagePlaces.filter(massagePlace => massagePlace._id === massageplaceid);
        if (selectedMassagePlace.length > 0) {
            this.props.setSelectedMassagePlace(selectedMassagePlace[0]);

            this.props.history.push(`/member/massageplace/d/${massageplaceid}`);
        }
    }

    mapStateMassagePlacesToCards = () => {
        return (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>

                {this.state.massagePlaces.map((massagePlace, index) => {
                    let boxBackgroundColor = '';
                    let buttonText = 'Choose';
                    let isButtonDisabled = false;

                    if (massagePlace.capacity <= massagePlace.orderCount) {
                        boxBackgroundColor = '#eb4d4b' //Carmine pink
                        buttonText = 'Full';
                        isButtonDisabled = true;
                    }
                    else if (massagePlace.capacity / 2 <= massagePlace.orderCount) {
                        boxBackgroundColor = '#ffbe76' //spiced nectarine
                    }
                    else {
                        boxBackgroundColor = '#badc58' //June bud
                    }

                    return (
                        <div style={{ display: 'flex', flexDirection: 'column' }} key={massagePlace._id}>
                            <Card
                                style={{ backgroundColor: boxBackgroundColor }}
                                key={massagePlace._id}
                                id={massagePlace._id}
                                heading={massagePlace.placeName}
                                body={{
                                    Capacity: `${massagePlace.orderCount} / ${massagePlace.capacity} person (s)`
                                }}
                                onButtonClick={() => this.massagePlaceClicked(massagePlace._id)}
                                buttonText={buttonText}
                                isButtonDisabled={isButtonDisabled}
                            />
                            <div className="ui small feed">
                                <div className="event">
                                    <div className="content">
                                        <div className="summary">
                                            <p style={{ margin: '0' }}>City : {massagePlace.city.cityName}</p>
                                            <p>Address: {massagePlace.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
                }
            </div>
        )
    }

    mapCitiesToCheckboxes() {
        const { cities } = this.state;
        return cities.map(city => {
            return (
                <div className="ui checkbox" style={{ display: 'block' }} key={city._id}>
                    <input type="checkbox" tabIndex="0" className="" name={city._id} checked={city.isChecked} onChange={this.handleCityCheckBoxFilterChange} />
                    <label>{city.cityName}</label>
                </div>
            )
        })
    }

    render() {
        //Redux props
        const { error } = this.props;

        const { searchInput, ongoingOrders, currTime } = this.state;

        return (
            <div>
                <React.Fragment>
                    <section id="currtime">
                        <h4 style={{display:'inline-block'}}>Current Time : {formatDate(currTime)}</h4>
                    </section>
                    {ongoingOrders &&
                        <OngoingOrders
                            ongoingOrders={ongoingOrders}
                        />
                    }

                    {error.message &&
                        <div className="alert danger-alert">
                            {error.message}
                        </div>
                    }
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <h1 style={{ display: 'inline', margin: '0', marginRight: '10px', verticalAlign: 'middle' }}>Massage Places</h1>
                        <div className="ui icon input" style={{ width: '30rem' }}>
                            <i className="search icon"></i>
                            <input type="text" placeholder="Search..." onChange={this.handleSearchInputChange} value={searchInput} />
                        </div>
                    </div>
                    <hr />
                    <h3> Filter by city</h3>
                    {this.mapCitiesToCheckboxes()}
                    <div style={{ display: 'block', textAlign: 'left', marginBottom: '.5rem' }}>
                        <ul className="legend">
                            <li><span className="available"></span>Available</li>
                            <li><span className="almostfull"></span>Almost full</li>
                            <li><span className="full"></span>Full</li>
                        </ul>
                        <br style={{ clear: 'both' }} />
                    </div>
                    <div style={{ display: 'flex' }}>
                        {this.mapStateMassagePlacesToCards()}
                    </div>
                </React.Fragment>
            </div>
        )
    }

    componentDidMount() {
        //Get all massage places
        const massagePlaces = apiCall('get', '/api/massageplace/getallwithdetail')
            .then(massagePlaces => {
                this.setState({ ...this.state, constMassagePlaces: massagePlaces, massagePlaces: massagePlaces });
            })
            .catch(err => addError(err.message));

        //Get all cities
        const citiesFromAPI = apiCall('get', '/api/city/getall')
            .then(res => {
                const citiesWithIsCheckedProp = res.map(city => {
                    city.isChecked = true;
                    return city;
                });
                this.setState({
                    ...this.state, cities: citiesWithIsCheckedProp
                })
            })
            .catch(err => err);

        //Get ongoing orders for current user
        const { currentUser } = this.props;
        apiCall('get', `/api/member/${currentUser.user.id}/getongoingorders`)
            .then(res => {
                this.setState({ ...this.state, ongoingOrders: res });
            })
            .catch(err => console.log(err));

        //Sets interval for time display
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

Home.propTypes = {
    setSelectedMassagePlace: PropTypes.func.isRequired
}

function mapStateToProps(reactState) {
    return {
        currentUser: reactState.currentUser,
        error: reactState.error
    }
}

export default connect(mapStateToProps, { addError })(Home);