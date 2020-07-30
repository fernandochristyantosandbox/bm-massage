import React, { Component } from 'react'
import PropTypes from 'prop-types';

const Card = props => {
    const { id, heading, body, buttonText, onButtonClick, style, isButtonDisabled } = props;

    return (
        <div style={{alignSelf:'stretch'}}>
            <div key={id} className="ui card margin-right-xs full-height" style={style || {}}>
                <div className="content">
                    <div className="header">{heading}</div>
                </div>
                <div className="content">
                    <h4 className="ui sub header">Details</h4>
                    <div className="ui small feed">
                        {
                            Object.keys(body).map(key => (
                                <div key={key} className="event">
                                    <div className="content">
                                        <div className="summary">
                                            <a>{key}</a> : {body[key]}
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="extra content">
                    <button className="ui violet button" disabled={isButtonDisabled} onClick={onButtonClick}>{buttonText}</button>
                </div>
            </div>
        </div>
    )
}

Card.propTypes = {
    id: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    body: PropTypes.object.isRequired,
    buttonText: PropTypes.string.isRequired,
    onButtonClick: PropTypes.func,
    style: PropTypes.object,
    isButtonDisabled: PropTypes.bool
}

export default Card;