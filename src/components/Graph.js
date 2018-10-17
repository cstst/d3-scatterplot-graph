import React, { Component } from 'react';
import * as d3 from "d3";

export default class Graph extends Component {

  async componentDidMount() {
    const data = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
      .then(res => res.json());
    this.drawChart(data);
  }

  

  drawChart = data => {
    const seconds = data.map(rider => rider.Seconds),
          years = data.map(rider => rider.Year),
          height = 500,
          width = 700,
          padding = 20;

    const scaleX = d3.scaleLinear()
                     .domain([d3.min(years), d3.max(years)])
                     .range([padding, width - padding]);

    const scaleY = d3.scaleLinear()
                     .domain([d3.min(seconds), d3.max(seconds)])
                     .range([height - padding, padding]);

    d3.select('#display')
      .append('svg')
      .attr('height', height)
      .attr('width', width)
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cy', (rider, i) => height - scaleY(rider.Seconds)) 
      .attr('cx', (rider, i) => scaleX(rider.Year))
      .attr("r", 5)
      .style('fill', 'black');
  }

  render() {
    return (
      <div id="display">
      </div>
    )
  }
}
