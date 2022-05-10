import React, { useState } from 'react';
import CommandCopier from '../ui/command-copier/command-copier';
import IconButton from '../ui/icon-button';
import CloseIcon from '../icons/close';
import Dropdown from '../ui/dropdown';

import './model-ui.css';

const ModelUI = ({ dismissed, setDismiss }) => {
  const [expand, setExpand] = useState(false);

  const command = 'pip install -U kedro-viz';

  if (expand) {
    return (
      <>
        <div className="model-ui-expanded-header">
          <p>Parameters</p>

          <div className="close-button-container">
            <IconButton
              container={React.Fragment}
              ariaLabel="Close Model UI Panel"
              className="close-button"
              icon={CloseIcon}
              onClick={() => setExpand(false)}
            />
          </div>
        </div>
        <div className="model-ui-expanded-detail">
          <p className="subtext">Splitter_func.object</p>
        </div>
      </>
    );
  }

  return (
    <div className="update-reminder-unexpanded">
      <p>Parameters </p>
      <div className="buttons-container">
        <button className="kedro" onClick={() => setExpand(true)}>
          Expand
        </button>
        <button className="kedro" onClick={() => setDismiss(true)}>
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default ModelUI;
