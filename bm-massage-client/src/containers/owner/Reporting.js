import React, { Component } from 'react'
import * as d3 from 'd3';
import { apiCall } from '../../services/api'
import { formatDate } from '../../services/date'
const $ = require('jquery')

const PieChart = props => {
  const datas = props.data;
  const width = 400;
  const height = 400;

  const dates = [];
  datas.forEach((data) => {
    dates.push(data.date)
  });

  const colorScale = d3.scaleOrdinal()
    .domain(dates)
    .range(d3.schemeCategory10);

  d3.select('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`)
    .classed('chart', true);

  var arcs = d3.pie()
    .value(d => d.profit)(datas);

  var path = d3.arc()
    .outerRadius(width / 2)
    .innerRadius(0);

  d3.select('.chart')
    .selectAll('.arc')
    .data(arcs)
    .enter()
    .append('path')
    .classed('arc', true)
    .attr('fill', d => colorScale(d.data.profit))
    .attr('stroke', 'black')
    .attr('d', path);

  datas.forEach(data => {
    $('#pie-detail-ul').append(
      `<li>
          <span class="available" style="background-color:${colorScale(data.profit)}"></span>
            ${formatDate(data.date, 'LL')} - <b>Rp. ${data.profit},-<b/>
        </li><br/>`
    )
  })

  return (
    <div>
      <svg></svg>
      <div id="pie-detail">
        <h4>Total profit by date</h4>
        <ul id="pie-detail-ul" className="legend">

        </ul>
      </div>
    </div>
  )
}

class Reporting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }

  render() {
    const { data } = this.state;
    return (
      <React.Fragment>
        <h1>Reporting</h1>
        <form className="ui form">
          <div className="field">
            <label htmlFor="start">From: </label>
            <input type="date" placeholder="From" />
          </div>
          <div className="field">
            <label htmlFor="start">Until: </label>
            <input type="date" placeholder="Until" />
          </div>
        </form>
        <div>
          <PieChart
            data={data}
          />
        </div>
      </React.Fragment>
    )
  }

  componentDidMount() {
    apiCall('get', `/api/data/rangeddate/2018-08-14/2018-08-17`)
      .then(res => {
        this.setState({ ...this.state, data: res });
      })
      .catch(err => {
        return err;
      })
  }
}

export default Reporting;