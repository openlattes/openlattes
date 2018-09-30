import React from 'react';
import PropTypes from 'prop-types';
import { OrdinalFrame } from 'semiotic';

const StackedBarChart = ({ data, colorHash }) => (
  <OrdinalFrame
    size={[900, 500]}
    data={data}
    oAccessor="year"
    rAccessor="count"
    style={d => ({ fill: colorHash[d.type], stroke: 'white' })}
    type="bar"
    projection="vertical"
    axis={{
      orient: 'left',
    }}
    margin={{
      top: 5, bottom: 50, right: 10, left: 50,
    }}
    oLabel={d => (
      <text transform="translate(-15,0)rotate(45)">{d}</text>
    )}
    sortO={(a, b) => a > b}
    oPadding={2}
    baseMarkProps={{ forceUpdate: true }}
  />
);

StackedBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    year: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
  })).isRequired,
  /* eslint-disable react/forbid-prop-types */
  colorHash: PropTypes.object.isRequired,
  /* eslint-enable react/forbid-prop-types */
};

export default StackedBarChart;
