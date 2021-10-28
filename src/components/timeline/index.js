import React from 'react';
import { connect } from 'react-redux';
import { useQuery } from '@apollo/client';
import { GET_RUNS } from '../../apollo/queries';
import TimelineChart from './timeline-chart';

import './timeline.css';

const leftArea = 480;

export const Timeline = ({ visible }) => {
  const { data } = useQuery(GET_RUNS);

  // extract the data and no. of nodes from the data
  const plotData = data
    ? data.runsList.map((run) => ({
        date: new Date(run.metadata.timestamp.slice(0, -5).replace(/\./g, ':')),
        value: run.metadata.selectedNodes,
      }))
    : [];

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
      <TimelineChart data={plotData} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  visible: state.visible.timeline,
});

export default connect(mapStateToProps)(Timeline);
