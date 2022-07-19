import React, { useState } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import FlowchartPrimaryToolbar from '../flowchart-primary-toolbar';
import MiniMap from '../minimap';
import MiniMapToolbar from '../minimap-toolbar';
import NodeList from '../node-list';
import PipelineList from '../pipeline-list';

import './sidebar.css';

/**
 * Main app container. Handles showing/hiding the sidebar nav, and theme classes.
 * @param {boolean} props.visible Whether the sidebar is open/closed
 */
export const Sidebar = ({ visible }) => {
  const [pipelineIsOpen, togglePipeline] = useState(false);

  return (
    <>
      <div
        className={classnames('pipeline-sidebar', {
          'pipeline-sidebar--visible': visible,
        })}
      >
        <div className="pipeline-ui">
          <PipelineList onToggleOpen={togglePipeline} />
          <NodeList faded={pipelineIsOpen} />
        </div>
        <nav className="pipeline-toolbar">
          <FlowchartPrimaryToolbar />
          <MiniMapToolbar />
        </nav>
        <MiniMap />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  visible: state.visible.sidebar,
});

export default connect(mapStateToProps)(Sidebar);
