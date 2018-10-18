import React, { Component } from 'react';
import * as d3 from 'd3';

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
          color = d3.scaleOrdinal(d3.schemeCategory10),
          xScale = d3.scaleLinear()
                     .domain([d3.min(years) - 1, d3.max(years) + 1])
                     .range([padding, width - padding]),
          yScale = d3.scaleTime()
                     .domain([d3.min(time), d3.max(time)])
                     .range([padding, height - padding]),
          xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('d')),
          yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat('%M:%S')),
          tooltip = d3.select("#graph")
                      .append("div")
                      .attr("id", "tooltip")
    svg.selectAll('circle')
       .data(data)
       .enter()
       .append('circle')
       .attr('cy', (rider, i) => yScale(rider.Time)) 
       .attr('cx', (rider, i) => xScale(rider.Year))
       .attr('r', 5)
       .attr('data-xvalue', (rider, i) => rider.Year)
       .attr('data-yvalue', (rider, i) => rider.Time.toISOString().split('.')[0].slice(-5))
       .attr('class', 'dot')
       .style('fill', (rider, i) => color(rider.Doping === ''))
       .on('mouseover', (rider, i) => {
         tooltip.text(`${rider.Name}: ${rider.Nationality}\nYear: ${rider.Year}, Time: ${rider.Time.toISOString().split('.')[0].slice(-5)}`)
                .attr('data-year', rider.Year)
                .style("visibility", "visible")
       })
       .on("mousemove", () => {
         tooltip.style("top", (d3.event.pageY - 10)+"px")
                .style("left",(d3.event.pageX + 10)+"px");
       })
       .on("mouseout", () => {
         tooltip.style("visibility", "hidden")
       });

    svg.append('g')
       .attr('id', 'y-axis')
       .attr('transform', `translate(${padding}, 0)`)
       .call(yAxis);
       
    svg.append('g')
       .attr('transform', `translate(0, ${height - padding})`)
       .attr('id', 'x-axis')
       .call(xAxis);
    
    svg.append('text')
       .attr('x', width / 3)
       .attr('y', padding)
       .attr('id', 'title')
       .text('Doping in Professional Cycling')
    
    svg.append('text')
       .attr('x', width / 3)
       .attr('y', padding * 1.5)
       .attr('id', 'subtitle')
       .text('35 Fastest times up Alpe d\'Huez');
    
    const legend = svg.selectAll('.legend')
                      .data(color.domain())
                      .enter()
                      .append('g')
                      .attr('class', 'legend')
                      .attr('id', 'legend')
                      .attr('transform', (d, i) => `translate(0, ${height/2 - i * 20})`);
   
    legend.append('rect')
          .attr('x', width - 18)
          .attr('width', 18)
          .attr('height', 18)
          .style('fill', color);
   
    legend.append('text')
          .attr('x', width - 24)
          .attr('y', 9)
          .attr('dy', '.35em')
          .style('text-anchor', 'end')
          .text(d => d ? 'Riders with doping allegations' : 'No doping allegations');
  }

  render() {
    return (
      <div id='graph'>
      </div>
    )
  }
}
