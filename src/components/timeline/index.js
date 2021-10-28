import React from 'react';
import { connect } from 'react-redux';
import { useQuery } from '@apollo/client';
import { GET_RUNS } from '../../apollo/queries';
import TimelineChart from './timeline-chart';

import './timeline.css';

const leftArea = 480;

export const Timeline = ({ pipelineId, visible }) => {
  const { data } = useQuery(GET_RUNS);

  // const updatePipeline = (id) => {
  //   console.log(id);
  // };

  console.log('data', data);
  // extract the data and no. of nodes from the data
  const plotData = data
    ? data.runsList.map((run) => ({
        date: new Date(run.metadata.timestamp.slice(0, -5).replace(/\./g, ':')),
        id: run.metadata.id,
        title: run.metadata.title,
        selectedNodes: run.metadata.selectedNodes,
        totalNodes: run.metadata.totalNodes,
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
      <span>{pipelineId}</span>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    visible: state.visible.timeline,
  };
};

export default connect(mapStateToProps)(Timeline);
