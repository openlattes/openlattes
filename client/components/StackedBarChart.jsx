import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { OrdinalFrame } from 'semiotic';

import CustomTooltip from './CustomTooltip';

const otherProps = new Map([
  [
    'vertical',
    {
      oLabel: d => <text transform="translate(-15,0)rotate(45)">{d}</text>,
      axis: {
        orient: 'left',
      },
      left: 50,
      toolTip: {
        left: -58,
        bottom: 78,
      },
    },
  ],
  [
    'horizontal',
    {
      oLabel: { label: true },
      axis: {
        rotate: 45,
      },
      left: 300,
      toolTip: {
        left: 15,
        bottom: 28,
      },
    },
  ],
]);

// Calculate oPadding based on the number of bars.
function oPadding(bars) {
  const min = 2;
  const max = 30;

  return ((Math.abs(max - bars) + (max - bars)) / 2) + min;
}

class StackedBarChart extends PureComponent {
  render() {
    const {
      data, colorHash, by, projection, onClick,
    } = this.props;

    const {
      axis, oLabel, left, toolTip,
    } = otherProps.get(projection);

    // Get number of bars.
    const bars = data
      .reduce((set, line) => set.add(line[by]), new Set())
      .size;

    return (
      <OrdinalFrame
        size={[1000, 500]}
        data={data}
        oAccessor={by}
        rAccessor="count"
        style={d => ({ fill: colorHash.get(d.type), stroke: 'white' })}
        type="bar"
        projection={projection}
        axis={axis}
        margin={{
          top: 5, bottom: 50, right: 10, left,
        }}
        oLabel={oLabel}
        sortO={(a, b) => a - b}
        oPadding={oPadding(bars)}
        baseMarkProps={{ forceUpdate: true }}
        hoverAnnotation
        tooltipContent={(d) => {
          const total = d.pieces.reduce((sum, { count }) => sum + count, 0);

          return (
            <CustomTooltip
              left={toolTip.left}
              bottom={toolTip.bottom}
              title1={`Total: ${total}`}
              clickHint
            />
          );
        }}
        customClickBehavior={onClick}
        download
        downloadFields={['type']}
      />
    );
  }
}

StackedBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    year: PropTypes.number,
    member: PropTypes.string,
    count: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
  })).isRequired,
  colorHash: PropTypes.instanceOf(Map).isRequired,
  by: PropTypes.string.isRequired,
  projection: PropTypes.string,
  onClick: PropTypes.func,
};

StackedBarChart.defaultProps = {
  projection: 'vertical',
  onClick: undefined,
};

export default StackedBarChart;
