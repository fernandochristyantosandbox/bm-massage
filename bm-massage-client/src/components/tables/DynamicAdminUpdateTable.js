import React, { Component } from 'react'
import PropTypes from 'prop-types';
const uuid = require('uuid');

class DynamicAdminUpdateTable extends Component {
  constructor(props) {
    super(props);
  }

  mapDataToRows = () => {
    const { data, handleInputChange, onButtonRemoveClick, handleAdminActiveChange } = this.props;
    const trRed = {
      backgroundColor: '#FFCCCC'
    }
    return (
      data.map((row, index) => {
        const tableBodiesExcludeRemove = this.props.tbody;
        return (
          <tr key={index} style={!row.username || !row.password ? trRed : {}}>
            {
              tableBodiesExcludeRemove.map((col, colIndex) => {
                return (
                  <td key={colIndex}>
                    <div className="ui input">
                      <input type="text" className="ui input" name={col} value={row[col]} onChange={(event) => handleInputChange(event, index)} />
                    </div>
                  </td>
                )
              })
            }
            <td key={3} style={{ verticalAlign: 'middle', paddingLeft: '10px', fontSize: '1.5rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={row.active} onChange={(event) => handleAdminActiveChange(event, index)}/>
            </td>
            <td key={4} style={{ verticalAlign: 'middle', paddingLeft: '10px', fontSize: '1.5rem', cursor: 'pointer' }}>
              <a style={{ color: 'red', fontWeight: '700' }} onClick={() => onButtonRemoveClick(index)}>{row.willDelete ? 'undo' : 'x'}</a>
            </td>
          </tr>
        )
      })
    )
  }

  render() {
    const { title, data, onButtonAddClick, onButtonRemoveClick, thead } = this.props;
    return (
      <React.Fragment>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h2 className="inline-block" style={{ margin: '0 10px' }}>{title}</h2>
          <a
            className="inline-block"
            onClick={onButtonAddClick}
            style={{ cursor: 'pointer', borderRadius: '8px', padding: '1px 3px', backgroundColor: 'white', border: '1px solid gray' }}>
            <i className="plus icon" style={{ fill: 'white', margin: '0' }}></i>
          </a>
        </div>
        <hr />
        <table className="ui celled table" style={{ width: '50%' }}>
          <thead>
            <tr>
              {thead.map((tableHead, index) => (
                <th key={index}>{tableHead}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {this.mapDataToRows()}
          </tbody>
        </table>
      </React.Fragment>
    )
  }
}

DynamicAdminUpdateTable.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  onButtonAddClick: PropTypes.func.isRequired,
  onButtonRemoveClick: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleAdminActiveChange: PropTypes.func.isRequired,
  thead: PropTypes.array.isRequired,
  tbody: PropTypes.array.isRequired
}

export default DynamicAdminUpdateTable