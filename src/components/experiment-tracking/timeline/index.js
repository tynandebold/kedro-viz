import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Zoom } from '@vx/zoom';
import { scaleLinear } from '@vx/scale';
import { Group } from '@vx/group';
import { HeatmapCircle, HeatmapRect } from '@vx/heatmap';
import genBins, { Bin, Bins } from '@vx/mock-data/lib/generators/genBins';
import './timeline.css';

const hot1 = '#77312f';
const hot2 = '#f33d15';
const cool1 = '#122549';
const cool2 = '#b4fbde';
export const background = '#28272c';

const binData = genBins(30, 24);

function max(data, value) {
  return Math.max(...data.map(value));
}

function min(data, value) {
  return Math.min(...data.map(value));
}

// accessors
const bins = (d) => d.bins;
const count = (d) => d.count;

const colorMax = max(binData, (d) => max(bins(d), count));
const bucketSizeMax = max(binData, (d) => bins(d).length);

// scales
const xScale = scaleLinear({
  domain: [0, binData.length],
});
const yScale = scaleLinear({
  domain: [0, bucketSizeMax],
});
const circleColorScale = scaleLinear({
  range: [hot1, hot2],
  domain: [0, colorMax],
});
const rectColorScale = scaleLinear({
  range: [cool1, cool2],
  domain: [0, colorMax],
});
const opacityScale = scaleLinear({
  range: [0.1, 1],
  domain: [0, colorMax],
});

const defaultMargin = { top: 10, left: 20, right: 20, bottom: 110 };

/**
 * Main experiment tracking page container. Handles showing/hiding the sidebar nav for experiment tracking,
 * the display of experiment details, as well as the comparison view.
 */
const Timeline = ({
  width = 800,
  height = 450,
  events = false,
  margin = defaultMargin,
  separation = 20,
  sidebarVisible,
}) => {
  const size =
    width > margin.left + margin.right
      ? width - margin.left - margin.right - separation
      : width;
  const xMax = size / 2;
  const yMax = height - margin.bottom - margin.top;

  const binWidth = xMax / binData.length;
  const binHeight = yMax / bucketSizeMax;
  const radius = min([binWidth, binHeight], (d) => d) / 2;

  xScale.range([0, xMax]);
  yScale.range([yMax, 0]);

  const onClickCallBack = () => {
    if (!events) {
      return;
    }
    const { row, column } = this.bin;
    alert(JSON.stringify({ row, column, bin: this.bin.bin }));
  };

  return width < 10 ? null : (
    <>
      <div
        className={classnames('kedro', 'details-mainframe', {
          'details-mainframe--sidebar-visible': sidebarVisible,
        })}
      >
        <svg width={width} height={height}>
          <Group top={margin.top} left={margin.left}>
            <HeatmapCircle
              data={binData}
              xScale={xScale}
              yScale={yScale}
              colorScale={circleColorScale}
              opacityScale={opacityScale}
              radius={radius}
              gap={2}
            >
              {(heatmap) => {
                console.log('heatmap', heatmap);
                return heatmap.map((heatmapBins) =>
                  heatmapBins.map((bin) => (
                    <circle
                      key={`heatmap-circle-${bin.row}-${bin.column}`}
                      className="vx-heatmap-circle"
                      cx={bin.cx}
                      cy={bin.cy}
                      r={bin.r}
                      fill={bin.color}
                      fillOpacity={bin.opacity}
                      onClick={onClickCallBack}
                    />
                  ))
                );
              }}
            </HeatmapCircle>
          </Group>
          <Group top={margin.top} left={xMax + margin.left + separation}>
            <HeatmapRect
              data={binData}
              xScale={xScale}
              yScale={yScale}
              colorScale={rectColorScale}
              opacityScale={opacityScale}
              binWidth={binWidth}
              binHeight={binWidth}
              gap={2}
            >
              {(heatmap) =>
                heatmap.map((heatmapBins) =>
                  heatmapBins.map((bin) => (
                    <rect
                      key={`heatmap-rect-${bin.row}-${bin.column}`}
                      className="vx-heatmap-rect"
                      width={bin.width}
                      height={bin.height}
                      x={bin.x}
                      y={bin.y}
                      fill={bin.color}
                      fillOpacity={bin.opacity}
                      onClick={onClickCallBack}
                    />
                  ))
                )
              }
            </HeatmapRect>
          </Group>
        </svg>
      </div>
    </>
  );
};

export const mapStateToProps = (state) => ({
  sidebarVisible: state.visible.sidebar,
});

export default connect(mapStateToProps)(Timeline);
