import React from 'react';
import { connect } from 'react-redux';

import './timeline.css';

const width = 1500;
const height = 300;

const DURATION = 700;
const TRANSITION_WAIT = 200;

export const Timeline = ({ visible }) => {
  const transformStyle = {
    transform: `translate(calc(-100% + ${width}px), -100%)`,
  };

  return (
    <div
      className="pipeline-timeline-container"
      style={visible ? transformStyle : {}}
    >
      <div className="pipeline-timeline">
        {/* ref={this.containerRef}> */}
        <svg
          id="pipeline-timeline-graph"
          className="pipeline-timeline__graph"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
        >
          <rect
            className="pipeline-timeline__viewport"
            // ref={this.viewportRef}
          />
        </svg>
      </div>
    </div>
  );
};

export const mapStateToProps = (state, ownProps) => ({
  visible: state.visible.timeline,
  ...ownProps,
});

export const mapDispatchToProps = (dispatch, ownProps) => ({
  ...ownProps,
});

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
