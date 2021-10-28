import React from 'react';
import * as d3 from 'd3';

const leftArea = 480;

export const TimelineChart = ({ data }) => {
  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 30, bottom: 30, left: 30 },
    width = window.innerWidth - leftArea - margin.left - margin.right,
    height = 222 - margin.top - margin.bottom;

  let xAxis;

  // append the svg object to the body of the page
  const svg = d3
    .select('#timeline-chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  //Read the data

  // Add X axis --> it is a date format
  const x = d3
    .scaleTime()
    .domain(
      d3.extent(data, function (d) {
        return d.date;
      })
    )
    .range([0, width]);

  xAxis = svg
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3
    .scaleLinear()
    .domain([
      d3.min(data, function (d) {
        return +d.value - 5;
      }),
      d3.max(data, function (d) {
        return +d.value + 5;
      }),
    ])
    .range([height, 0]);
  svg.append('g').call(d3.axisLeft(y));

  // Add a clipPath: everything out of this area won't be drawn.
  const clip = svg
    .append('defs')
    .append('svg:clipPath')
    .attr('id', 'clip')
    .append('svg:rect')
    .attr('width', width)
    .attr('height', height)
    .attr('x', 0)
    .attr('y', 0);

  // Add brushing
  const brush = d3
    .brushX() // Add the brush feature using the d3.brush function
    .extent([
      [0, 0],
      [width, height],
    ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    .on('end', updateChart); // Each time the brush selection changes, trigger the 'updateChart' function

  // Create the line variable: where both the line and the brush take place
  const line = svg.append('g').attr('clip-path', 'url(#clip)');

  // Add the line
  line
    .append('path')
    .datum(data)
    .attr('class', 'line') // I add the class line to be able to modify this line later on.
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .attr(
      'd',
      d3
        .line()
        .x(function (d) {
          return x(d.date);
        })
        .y(function (d) {
          return y(d.value);
        })
    );

  // Add the brushing
  line.append('g').attr('class', 'brush').call(brush);

  let Tooltip = d3
    .select('#timeline-chart')
    .append('div')
    .style('opacity', 0)
    .attr('class', 'tooltip')
    .style('background-color', 'white')
    .style('border', 'solid')
    .style('border-width', '2px')
    .style('border-radius', '5px')
    .style('padding', '5px');

  // Three function that change the tooltip when user hover / move / leave a cell
  const mouseover = function (d) {
    Tooltip.style('opacity', 1);
  };
  const mousemove = function (d) {
    Tooltip.html('Exact value: ' + d.value)
      .style('left', d3.pointer(this)[0] + 70 + 'px')
      .style('top', d3.pointer(this)[1] + 'px');
  };
  const mouseleave = function (d) {
    Tooltip.style('opacity', 0);
  };

  // Add the points
  line
    .append('g')
    .selectAll('dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'circles')
    .attr('cx', function (d) {
      return x(d.date);
    })
    .attr('cy', function (d) {
      return y(d.value);
    })
    .attr('r', 2)
    .attr('stroke', '#69b3a2')
    .attr('stroke-width', 3)
    .attr('fill', 'white')
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseleave', mouseleave);

  // A function that set idleTimeOut to null
  let idleTimeout;
  function idled() {
    idleTimeout = null;
  }

  // A function that update the chart for given boundaries
  function updateChart(event, d) {
    // What are the selected boundaries?
    const extent = event.selection;

    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if (!extent) {
      if (!idleTimeout) {
        return (idleTimeout = setTimeout(idled, 350));
      } // This allows to wait a little bit
      x.domain([4, 8]);
    } else {
      x.domain([x.invert(extent[0]), x.invert(extent[1])]);
      line.select('.brush').call(brush.move, null); // This remove the grey brush area as soon as the selection has been done
    }

    // Update axis and line position
    xAxis.transition().duration(1000).call(d3.axisBottom(x));

    line
      .select('.line')
      .transition()
      .duration(1000)
      .attr(
        'd',
        d3
          .line()
          .x(function (d) {
            return x(d.date);
          })
          .y(function (d) {
            return y(d.value);
          })
      );

    line
      .select('.line')
      .transition()
      .duration(1000)
      .attr(
        'd',
        d3
          .line()
          .x(function (d) {
            return x(d.date);
          })
          .y(function (d) {
            return y(d.value);
          })
      );
  }

  // If user double click, reinitialize the chart
  svg.on('dblclick', function () {
    x.domain(
      d3.extent(data, function (d) {
        return d.date;
      })
    );
    xAxis.transition().call(d3.axisBottom(x));
    line
      .select('.line')
      .transition()
      .attr(
        'd',
        d3
          .line()
          .x(function (d) {
            return x(d.date);
          })
          .y(function (d) {
            return y(d.value);
          })
      );
  });

  return <div id="timeline-chart"></div>;
};

export default TimelineChart;
