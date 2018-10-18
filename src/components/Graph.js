import React, { Component } from 'react';
import * as d3 from "d3";

export default class Graph extends Component {

  async componentDidMount() {
    const data = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
      .then(res => res.json());
    this.drawChart(data);
  }

  drawChart(data) {
    data.forEach(rider => {
      const splitTime = rider.Time.split(':');
      rider.Time = new Date(Date.UTC(1970, 0, 1, 0, splitTime[0], splitTime[1]))
    });

    const time = data.map(rider => rider.Time),
          years = data.map(rider => rider.Year),
          height = 500,
          width = 700,
          padding = 40,
          svg = d3.select('#graph')
                  .append('svg')
                  .attr('height', height)
                  .attr('width', width),
          xScale = d3.scaleLinear()
                     .domain([d3.min(years) - 1, d3.max(years) + 1])
                     .range([padding, width - padding]),
          yScale = d3.scaleTime()
                     .domain([d3.min(time), d3.max(time)])
                     .range([padding, height - padding]),
          xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format("d")),
          yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat("%M:%S"));
    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cy', (rider, i) => yScale(rider.Time)) 
      .attr('cx', (rider, i) => xScale(rider.Year))
      .attr('r', 5)
      .attr('class', 'circle')
      .append('title')
      .text(d => d.Name)


    svg.append("g")
       .attr('id', 'y-axis')
       .attr('transform', `translate(${padding}, 0)`)
       .call(yAxis);
       
    svg.append("g")
       .attr('transform', `translate(0, ${height - padding})`)
       .attr('id', 'x-axis')
       .call(xAxis);
    
    
  }

  render() {
    return (
      <div id="graph">
      </div>
    )
  }
}
