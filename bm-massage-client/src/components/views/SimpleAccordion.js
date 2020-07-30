import React, { Component } from 'react'
import PropTypes from 'prop-types'

class SimpleAccordion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      datas: [],
      buttonText: undefined,
      buttonHandler: undefined,
      buttonClass: undefined
    }
  }

  handleItemClick = index => {
    //TODO SET CLICKED ITEM INDEX TO ACTIVE
    this.setAllStateDatasToInactive();
    const { datas } = this.state;
    const datasClone = datas.map((data, i) => {
      return {
        ...data,
        id: data.id,
        title: data.title,
        content: [...data.content],
        isActive: i === index && !data.isActive,
      }
    });
    this.setState({ ...this.state, datas: datasClone });
  }

  setAllStateDatasToInactive = () => {
    const { datas } = this.state;
    const datasClone = datas.map(data => {
      return {
        ...data,
        id: data.id,
        title: data.title,
        content: [...data.content],
        isActive: false
      }
    });
    this.setState({ ...this.state, datas: datasClone });
  }

  mapAccordionItems = () => {
    const { datas } = this.state;

    return datas.map((data, i) => {
      const titleClass = data.isActive ? "title active" : "title";
      const contentClass = data.isActive ? "content active" : "content";
      return (
        <div key={data.id}>
          <div className={titleClass} onClick={() => this.handleItemClick(i)} style={{ paddingBottom: '0' }}>
            <i className="dropdown icon"></i>
            <b><em>{data.title}</em></b>
          </div>
          <div className={contentClass} style={{ paddingLeft: '2rem', paddingTop: '0' }}>
            {
              data.content.map((content, j) => {
                const isImportant = content.startsWith("!!");
                let importantStyle = {};
                if (isImportant) {
                  importantStyle = { color: 'red' };
                  content = content.substring(2, content.length);
                }
                return (
                  <p key={j} className="margin0" style={importantStyle}>{content}</p>
                )
              })
            }
            {(data.buttonText && data.buttonHandler) &&
              <button className={`${data.buttonClass}`} onClick={data.buttonHandler}>{data.buttonText}</button>
            }
            {(data.buttonText2 && data.buttonHandler2) &&
              <button className={`${data.buttonClass2}`} onClick={data.buttonHandler2}>{data.buttonText2}</button>
            }
          </div>
        </div>
      )
    })
  }

  render() {
    return (
      <div className="ui accordion">
        {this.mapAccordionItems()}
      </div>
    )
  }

  componentDidMount() {
    const { datas } = this.props;
    const datasForState = datas.map(data => {
      let newData = {
        ...data,
        id: data.id,
        title: data.title,
        content: [...data.content]
      }
      return newData;
    });

    this.setState({ ...this.state, datas: datasForState });
  }
}

SimpleAccordion.propTypes = {
  datas: PropTypes.array.isRequired
  /**
    * datas: [{
    *  id: "...",
    *  title: "Title",
    *  content: ["Content line 1", "Content line 2", "Content line 3"]
    * }]
   */
}

export default SimpleAccordion;