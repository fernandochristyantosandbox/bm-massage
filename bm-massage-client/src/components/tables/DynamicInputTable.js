import React, { Component } from 'react'
import PropTypes from 'prop-types';

class DynamicInputTable extends Component {
    constructor(props) {
        super(props);
    }

    mapDataToRows = () => {
        const { data, handleInputChange, onButtonRemoveClick} = this.props;

        return (
            data.map((row, index) => {
                const keys = Object.keys(row);
                return (
                    <tr key={index}>
                        <td><input value={row[keys[0]]} onChange={(event) => handleInputChange(event, index)}/></td>
                        <td style={{verticalAlign:'middle', paddingLeft: '10px', fontSize: '1.5rem', cursor: 'pointer'}}>
                            <a style={{ color: 'red', fontWeight: '900' }} onClick={() => onButtonRemoveClick(index)}>x</a>
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
                        style={{ cursor: 'pointer', borderRadius: '8px', padding: '2px', backgroundColor: 'white', border: '1px solid gray' }}>
                        <i className="plus icon" style={{ fill: 'white' }}></i>
                    </a>
                </div>
                <hr />
                <table className="ui celled table" style={{width: '50%'}}>
                    <thead>
                        <tr>
                            <th>{thead}</th>
                            <th>Remove</th>
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

DynamicInputTable.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    onButtonAddClick: PropTypes.func.isRequired,
    onButtonRemoveClick: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    thead: PropTypes.string.isRequired
}

export default DynamicInputTable