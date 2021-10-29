import React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import { loadTimelinePipelineData } from '../../actions/pipelines';

const leftArea = 480;

export const TimelineChart = ({ data, updatePipeline }) => {
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
        return +d.selectedNodes - 5;
      }),
      d3.max(data, function (d) {
        return +d.totalNodes + 5;
      }),
    ])
    .range([height, 0]);

  svg.append('g').call(d3.axisLeft(y));

  // Add a clipPath: everything out of this area won't be drawn.
  svg
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

  // Total nodes line
  line
    .append('path')
    .datum(data)
    .attr('class', 'line-1') // Add class to be able to modify line later on.
    .attr('fill', 'none')
    .attr('stroke', '#00b0f5')
    .attr('stroke-width', 1.5)
    .attr(
      'd',
      d3
        .line()
        .x(function (d) {
          return x(d.date);
        })
        .y(function (d) {
          return y(d.totalNodes);
        })
    );

  // Selected nodes line
  line
    .append('path')
    .datum(data)
    .attr('class', 'line-2') // Add class to be able to modify line later on.
    .attr('fill', 'none')
    .attr('stroke', '#ffbc00')
    .attr('stroke-width', 1.5)
    .attr(
      'd',
      d3
        .line()
        .x(function (d) {
          return x(d.date);
        })
        .y(function (d) {
          return y(d.selectedNodes);
        })
    );

  // Add the brushing
  line.append('g').attr('class', 'brush').call(brush);

  const tooltip = d3
    .select('#timeline-chart')
    .append('div')
    .style('opacity', 0)
    .attr('class', 'tooltip')
    .style('background-color', 'white')
    .style('padding', '10px')
    .style('position', 'absolute')
    .style('font-size', '12px')
    .style('color', 'white');

  const showTooltip = function (event, d) {
    d3.selectAll('.circle').transition().duration(175).attr('r', 3);

    tooltip
      .html(
        'Nodes: ' +
          d.totalNodes +
          '<br />Run: ' +
          d.title +
          '<br /><button id="show-pipeline">Show pipeline</button>'
      )
      .transition()
      .duration(200)
      .style('opacity', 1)
      .style('color', '#000')
      .style('pointer-events', 'all')
      .style('left', x(d.date) + 10.5 + 'px')
      .style('top', 101 + 'px');

    d3.select('#show-pipeline').on('click', function () {
      updatePipeline(d.id);
    });

    d3.select(this).transition().duration(175).attr('r', 8);
  };

  // Add the points
  svg
    .append('g')
    .selectAll('dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'circle')
    .attr('cx', function (d) {
      return x(d.date);
    })
    .attr('cy', height) // OR function (d) { return y(d.totalNodes); }
    .attr('r', 3)
    .attr('stroke', '#69b3a2')
    .attr('stroke-width', 3)
    .attr('fill', '#fff')
    .on('mouseover', showTooltip);

  // A function that set idleTimeOut to null
  let idleTimeout;
  function idled() {
    idleTimeout = null;
  }

  // A function that update the chart for given boundaries
  function updateChart(event) {
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

    redrawLine(line, 1000, x, y);
    redrawCircles(svg, 1000, x, height);

    tooltip.style('opacity', 0);
  }

  // If user double click, reinitialize the chart
  svg.on('dblclick', function () {
    x.domain(
      d3.extent(data, function (d) {
        return d.date;
      })
    );

    xAxis.transition().duration(0).call(d3.axisBottom(x));

    redrawLine(line, 0, x, y);
    redrawCircles(svg, 0, x, height);
  });

  svg.on('click', function () {
    tooltip.style('opacity', 0).style('pointer-events', 'none');
    d3.selectAll('.circle').transition().duration(175).attr('r', 3);
  });

  // Legend
  svg
    .append('circle')
    .attr('cx', width - 200)
    .attr('cy', 5)
    .attr('r', 6)
    .style('fill', '#00b0f5');
  svg
    .append('circle')
    .attr('cx', width - 90)
    .attr('cy', 5)
    .attr('r', 6)
    .style('fill', '#ffbc00');
  svg
    .append('text')
    .attr('x', width - 185)
    .attr('y', 6)
    .text('Total nodes')
    .style('font-size', '12px')
    .style('fill', 'white')
    .attr('alignment-baseline', 'middle');
  svg
    .append('text')
    .attr('x', width - 75)
    .attr('y', 6)
    .text('Selected nodes')
    .style('font-size', '12px')
    .style('fill', 'white')
    .attr('alignment-baseline', 'middle');

  return <div id="timeline-chart"></div>;
};

function redrawLine(line, duration, x, y) {
  line
    .select('.line-1')
    .transition()
    .duration(duration)
    .attr(
      'd',
      d3
        .line()
        .x(function (d) {
          return x(d.date);
        })
        .y(function (d) {
          return y(d.totalNodes);
        })
    );

  line
    .select('.line-2')
    .transition()
    .duration(duration)
    .attr(
      'd',
      d3
        .line()
        .x(function (d) {
          return x(d.date);
        })
        .y(function (d) {
          return y(d.selectedNodes);
        })
    );
}

function redrawCircles(svg, duration, x, height) {
  svg
    .selectAll('.circle')
    .transition()
    .duration(duration)
    .attr('cx', function (d) {
      return x(d.date);
    })
    .attr('cy', height)
    .attr('r', 3);
}

// export default TimelineChart;

export const mapStateToProps = (state) => ({});

export const mapDispatchToProps = (dispatch) => ({
  updatePipeline: (pipelineId) => {
    dispatch(loadTimelinePipelineData(pipelineId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TimelineChart);
