import React from 'react';
import { connect } from 'react-redux';
import { toggleMiniMap, toggleTimeline, updateZoom } from '../../actions';
import { getChartZoom } from '../../selectors/layout';
import IconButton from '../icon-button';
import MapIcon from '../icons/map';
import PlusIcon from '../icons/plus';
import MinusIcon from '../icons/minus';
import ResetIcon from '../icons/reset';
import './minimap-toolbar.css';

/**
 * Controls for minimap
 */
export const MiniMapToolbar = ({
  onToggleMiniMap,
  onToggleTimeline,
  visible,
  chartZoom,
  onUpdateChartZoom,
}) => {
  const { scale, minScale, maxScale } = chartZoom;

  return (
    <>
      <ul className="pipeline-minimap-toolbar kedro">
        <IconButton
          icon={MapIcon}
          className={'pipeline-minimap-button pipeline-minimap-button--map'}
          ariaLabel={`Turn minimap ${visible.miniMap ? 'off' : 'on'}`}
          onClick={() => {
            onToggleMiniMap(!visible.miniMap);
            onToggleTimeline(false);
          }}
          labelText={`${visible.miniMap ? 'Hide' : 'Show'} minimap`}
          visible={visible.miniMapBtn}
          active={visible.miniMap}
        />
        <IconButton
          icon={MapIcon}
          className={
            'pipeline-minimap-button pipeline-minimap-button--timeline'
          }
          ariaLabel={`Turn timeline ${visible.timeline ? 'off' : 'on'}`}
          onClick={() => {
            onToggleTimeline(!visible.timeline);
            onToggleMiniMap(false);
          }}
          labelText={`${visible.timeline ? 'Hide' : 'Show'} timeline`}
          visible={visible.miniMapBtn}
          active={visible.timeline}
        />
        <IconButton
          icon={PlusIcon}
          className={'pipeline-minimap-button pipeline-minimap-button--zoom-in'}
          ariaLabel={'Zoom in'}
          labelText={'Zoom in'}
          visible={visible.miniMapBtn}
          disabled={scale >= maxScale}
          onClick={() => onUpdateChartZoom(scaleZoom(chartZoom, 1.3))}
        />
        <IconButton
          icon={MinusIcon}
          className={
            'pipeline-minimap-button pipeline-minimap-button--zoom-out'
          }
          ariaLabel={'Zoom out'}
          labelText={'Zoom out'}
          visible={visible.miniMapBtn}
          disabled={scale <= minScale}
          onClick={() => onUpdateChartZoom(scaleZoom(chartZoom, 0.7))}
        />
        <IconButton
          icon={ResetIcon}
          className={'pipeline-minimap-button pipeline-minimap-button--reset'}
          ariaLabel={'Reset zoom'}
          labelText={'Reset zoom'}
          visible={visible.miniMapBtn}
          onClick={() => onUpdateChartZoom(scaleZoom(chartZoom, 0))}
        />
        <li>
          <span className="pipeline-minimap-toolbar__scale" title="Zoom level">
            {Math.round(100 * chartZoom.scale) || 100}%
          </span>
        </li>
      </ul>
    </>
  );
};

const scaleZoom = ({ scale }, factor) => ({
  scale: scale * (factor || 1),
  applied: false,
  transition: true,
  reset: factor === 0,
});

export const mapStateToProps = (state) => ({
  visible: state.visible,
  chartZoom: getChartZoom(state),
});

export const mapDispatchToProps = (dispatch) => ({
  onToggleMiniMap: (value) => {
    dispatch(toggleMiniMap(value));
  },
  onToggleTimeline: (value) => {
    dispatch(toggleTimeline(value));
  },
  onUpdateChartZoom: (transform) => {
    dispatch(updateZoom(transform));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MiniMapToolbar);
