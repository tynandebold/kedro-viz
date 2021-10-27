import React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import { useQuery } from '@apollo/client';
import { GET_RUNS } from '../../apollo/queries';
import TimelineChart from './timeline-chart';

import './timeline.css';

const height = 300;
const leftArea = 480;

export const Timeline = ({ visible }) => {
  const { data } = useQuery(GET_RUNS);

  // extract the data and no. of nodes from the data
  const plotData = data
    ? data.runsList.map((run) => ({
        date: run.metaData.timestamp,
        value: run.metaData.runNodes,
      }))
    : [];

  const sortedPlotData = plotData.sort((a, b) => a.date - b.date);

  // const width = window.innerWidth - leftArea;
  const transformStyle = {
    transform: `translate(calc(-100% + ${
      window.innerWidth - leftArea
    }px), -100%)`,
  };

  return (
    <div
      className="pipeline-timeline-container"
      style={visible ? transformStyle : {}}
    >
      <TimelineChart data={sortedPlotData} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  visible: state.visible.timeline,
});

export default connect(mapStateToProps)(Timeline);
