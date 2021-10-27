import React from 'react';
import { connect } from 'react-redux';

import './timeline.css';

const height = 300;
const leftArea = 480;

export const Timeline = ({ visible }) => {
  const width = window.innerWidth - leftArea;
  const transformStyle = {
    transform: `translate(calc(-100% + ${width}px), -100%)`,
  };

  return (
    <div
      className="pipeline-timeline-container"
      style={visible ? transformStyle : {}}
    >
      <div className="pipeline-timeline">
        <svg
          id="pipeline-timeline-graph"
          className="pipeline-timeline__graph"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  visible: state.visible.timeline,
});

export default connect(mapStateToProps)(Timeline);
