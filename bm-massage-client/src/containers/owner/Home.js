import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter, Route, Switch, Link } from 'react-router-dom';
import { apiCall } from '../../services/api';
import Card from '../../components/views/Card';
import PropTypes from 'prop-types';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: [],
            selectedCity: null,
            massagePlaces: []
        }
    }

    componentDidMount() {
        const citiesFromAPI = apiCall('get', '/api/city/getall')
            .then(res => { this.setState({ cities: res }) })
            .catch(err => err);
    }

    fillDdlCity() {
        return (
            <React.Fragment>
                <option>Select City</option>
                {this.state.cities.map(city => (
                    <option key={city._id} value={city._id}>{city.cityName}</option>
                ))}
            </React.Fragment>
        )
    }

    redirectToPlaceDetail(massagePlaceId){
        this.props.setStateSelectedCity(this.state.selectedCity);
        this.props.history.push(`/owner/managemassageplaces/v/${massagePlaceId}`);
    }

    onDdlCityChange = event => {
        const selectedCityId = event.target.value;
        const selectedCityArr = this.state.cities.filter(city => city._id === selectedCityId)
        const selectedCity = selectedCityArr && selectedCityArr.length > 0 ? selectedCityArr[0] : null;
        this.setState({ ...this.state, selectedCity });

        if (selectedCity) { //fetch massage places for that city
            const massagePlacesFromAPI = apiCall('get', `/api/city/${selectedCityId}/getallmassageplaces`)
                .then(res => { this.setState({ ...this.state, massagePlaces: res }) })
                .then(err => err);
        }
    }

    mapStateMassagePlacesToCards = () => {
        return (
            <div style={{ display: 'flex', flexWrap:'wrap' }}>

                {this.state.massagePlaces.map((massagePlace, index) => (
                    <Card
                        key={massagePlace._id}
                        id={massagePlace._id}
                        heading={massagePlace.placeName}
                        body={{
                            Admins: `${massagePlace.admins.length} admins`,
                            Capacity: `${massagePlace.capacity} person (s)`,
                            Address: massagePlace.address
                        }}
                        onButtonClick={() => this.redirectToPlaceDetail(massagePlace._id)}
                        buttonText="View place detail"
                    />
                ))
                }
            </div>
        )
    }

    onCityClicked = (event) => {
        event.preventDefault();
        this.props.setStateSelectedCity(this.state.selectedCity);
        this.props.history.push('/owner/managemassageplaces/createnew');
    }

    render() {
        const { selectedCity, massagePlaces } = this.state;
        return (
            <div>
                <h1>Home</h1>
                <hr />
                <label htmlFor="ddlCity" style={{ marginRight: '8px' }}>Select city to manage</label>
                <select name="ddlCity" id="ddlCity" onChange={this.onDdlCityChange}>
                    {this.fillDdlCity()}
                </select>
                <div style={{ marginTop: '10px' }}>
                    {selectedCity &&
                        <React.Fragment>
                            <h3>These are your massage places for city : {selectedCity.cityName}</h3>
                            <div id="massage-place-container">
                                {massagePlaces.length > 0 ?
                                    <div>
                                        <div style={{display: 'flex'}}>
                                            {this.mapStateMassagePlacesToCards()}
                                        </div>
                                        <p style={{marginTop: '30px'}}>
                                            <a style={{ cursor: 'pointer', color: 'royalblue', marginLeft: '5px' }}
                                                onClick={this.onCityClicked}>
                                                Add more massage places for this city
                                            </a>
                                        </p>
                                    </div>
                                    :
                                    <p>You don't have any massage place for this city,
                                        <a style={{ cursor: 'pointer', color: 'royalblue', marginLeft: '5px' }}
                                            onClick={this.onCityClicked}>
                                            create one now
                                        </a>
                                    </p>
                                }
                            </div>
                        </React.Fragment>
                    }
                </div>
            </div>
        )
    }
}

Home.propTypes = {
    setStateSelectedCity: PropTypes.func.isRequired
}

function mapStateToProps(reduxState) {
    return {
        currentUser: reduxState.currentUser
    }
}

export default withRouter(connect(mapStateToProps)(Home))