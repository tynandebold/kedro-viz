import React from 'react';
import { connect } from 'react-redux';
import { useQuery } from '@apollo/client';
import { GET_RUNS } from '../../apollo/queries';
import TimelineChart from './timeline-chart';

import './timeline.css';

const leftArea = 480;

export const Timeline = ({ pipelineId, visible }) => {
  const { data } = useQuery(GET_RUNS);

  console.log('data', data);

  const updatePipeline = (id) => {
    console.log(id);
  };

  // extract the data and no. of nodes from the data
  const plotData = data
    ? data.runsList.map((run) => ({
        date: run.metaData.timestamp,
        id: run.metaData.runId,
        title: run.metaData.title,
        selectedNodes: run.metaData.selectedNodes,
        totalNodes: run.metaData.totalNodes,
      }))
    : [];

  const sortedPlotData = plotData.sort((a, b) => a.date - b.date);

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
      <TimelineChart data={sortedPlotData} updatePipeline={updatePipeline} />
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
