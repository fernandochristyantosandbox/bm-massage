import React, { Component } from 'react'
import { connect } from 'react-redux'
import { apiCall } from '../../../services/api'
import PropTypes from 'prop-types';

const Massages = props => {
  const massagesToView = (massageTypes) => {
    const massageTypeIds = Object.keys(massageTypes);
    const { setSelectedMassagePlace } = props;
    return massageTypeIds.map(massageTypeId => {
      const massageTypeDetail = massageTypes[massageTypeId];

      return (
        <React.Fragment>
          <h3>{massageTypeDetail.name}</h3>
          <ul>
            {
              massageTypeDetail.massages.map(massage => {
                return (
                  <li style={{ paddingLeft: '1rem', marginBottom: '.5rem' }} key={massage._id} onClick={() => setSelectedMassagePlace(massage._id)}>
                    <a style={{ color: 'royalblue', cursor: 'pointer' }} >
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
        </React.Fragment>
      )
    })
  }

  const mapMassages = () => {
    const { massages } = props;

    const retMassages = {}
    /**
     * {
     *    <massagetypeid>: {
     *    name: '',
     *    massages: [
     *     massage1,
     *     massage2
     *   ]}
     * }
     */
    if (massages !== undefined && massages !== null) {
      massages.forEach(massage => {
        const massageTypeID = massage.massageType._id;
        if (massageTypeID in retMassages) { // append
          retMassages[massageTypeID] = {
            ...retMassages[massageTypeID],
            massages: [...retMassages[massageTypeID], massage]
          };
        }
        else {
          retMassages[massageTypeID] = {
            name: massage.massageType.name,
            massages: [massage]
          }
        }
      });
    }
    return massagesToView(retMassages);
  }

  return mapMassages();
}

Massages.propTypes = {
  massages: PropTypes.array.isRequired,
  setSelectedMassagePlace: PropTypes.func.isRequired
}

class MassagePlaceStats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      massageplace: undefined,
      selectedMassage: undefined,
      massageTypes: []
    }
  }

  setSelectedMassagePlace = (massageId) => {
    const { massages } = this.state.massageplace;
    const selectedMassage = massages.filter(massage => massage._id === massageId);

    if (selectedMassage.length > 0)
      this.setState({ ...this.state, selectedMassage: selectedMassage[0] });
  }

  openInsertMassagePlacePanel = () => {
    this.setState({ ...this.state, selectedMassage: {} })
  }

  removeSelectedMassagePlace = () => {
    this.setState({ ...this.state, selectedMassage: undefined });
  }

  fillDdlMassageType() {
    const { massageTypes } = this.state;
    return (
      <React.Fragment>
        <option>Select Massage Type</option>
        {massageTypes.map(massageType => (
          <option key={massageType._id} value={massageType._id}>{massageType.name}</option>
        ))}
      </React.Fragment>
    )
  }

  render() {
    const { massageplace, selectedMassage } = this.state;
    return (
      <div>
        {massageplace &&
          <div id="section-massageplace">
            <h1>Massage Place: {massageplace.placeName}</h1>
            <div id="place-details">
              <p>Maximum Capacity: {massageplace.capacity}</p>
              <p>Address: {massageplace.address}</p>
            </div>
          </div>
        }
        <div className="ui segment" style={{ marginTop: '20px' }}>
          <h2>Massages</h2>
          {massageplace &&
            <section id="massages">
              <Massages
                massages={massageplace.massages}
                setSelectedMassagePlace={this.setSelectedMassagePlace}
              />
            </section>
          }
          <button className="ui button green" onClick={this.openInsertMassagePlacePanel}>New Massage</button>
        </div>

        {selectedMassage &&
          <div className="ui segment">
            <h2>{selectedMassage._id ? selectedMassage.massageName : "New Massage"}</h2>
            <form action="" className="ui form">
              <div>
                <label htmlFor="ddlMassageType">Massage Type : </label>
                <select name="ddlMassageType" id="ddlMassageType" >
                  {this.fillDdlMassageType()}
                </select>
              </div>
              <div className="field" style={{ marginTop: '20px' }}>
                <label htmlFor="massagename">Massage Name</label>
                <input type="text" value={selectedMassage.massageName} />
              </div>
              <div className="field">
                <label htmlFor="capacity">Capacity</label>
                <input type="text" value={selectedMassage.capacity} />
              </div>
              <div className="field">
                <label htmlFor="price">Price</label>
                <input type="number" value={selectedMassage.price} />
              </div>
              <input type="button" value="Create" className="ui button green" />
              <input type="button" value="Cancel" className="ui button" onClick={this.removeSelectedMassagePlace} />
            </form>
          </div>
        }
      </div>
    )
  }

  componentDidMount() {
    const { currentUser } = this.props;
    const { massageplaceid } = currentUser;

    apiCall('get', `/api/massageplace/${massageplaceid}/getdetail`)
      .then(res => {
        this.setState({ ...this.state, massageplace: res })
      })
      .catch(err => {
        return err;
      });

    apiCall('get', '/api/massagetype/getall')
      .then(res => {
        this.setState({ ...this.state, massageTypes: res })
      })
      .catch(err => err);
  }
}

function mapStateToProps(reduxState) {
  return {
    currentUser: reduxState.currentUser.user
  }
}

export default connect(mapStateToProps, null)(MassagePlaceStats)