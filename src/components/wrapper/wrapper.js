import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import FlowChartWrapper from '../flowchart-wrapper';

import './wrapper.css';

/**
 * Main app container. Handles showing/hiding the sidebar nav, and theme classes.
 */
export const Wrapper = ({ theme }) => {
  return (
    <div
      className={classnames('kedro-pipeline kedro', {
        'kui-theme--dark': theme === 'dark',
        'kui-theme--light': theme === 'light',
      })}
    >
      <h1 className="pipeline-title">Kedro-Viz</h1>
      <FlowChartWrapper />
    </div>
  );
};

export const mapStateToProps = (state) => ({
  theme: state.theme,
});

export default connect(mapStateToProps)(Wrapper);
