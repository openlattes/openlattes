import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { OrdinalFrame } from 'semiotic';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const customTooltipContent = (d) => {
  const total = d.pieces.reduce((sum, { count }) => sum + count, 0);

  return (
    <Card
      style={{
        position: 'relative',
        left: '-40px',
        bottom: '78px',
        zIndex: 999999,
      }}
      raised
    >
      <CardContent>
        <Typography variant="body2">{total}</Typography>
      </CardContent>
    </Card>
  );
};

class StackedBarChart extends PureComponent {
  render() {
    const { data, colorHash, by } = this.props;

    return (
      <OrdinalFrame
        size={[900, 500]}
        data={data}
        oAccessor={by}
        rAccessor="count"
        style={d => ({ fill: colorHash.get(d.type), stroke: 'white' })}
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
        sortO={(a, b) => a - b}
        oPadding={2}
        baseMarkProps={{ forceUpdate: true }}
        hoverAnnotation
        tooltipContent={customTooltipContent}
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
};

export default StackedBarChart;
