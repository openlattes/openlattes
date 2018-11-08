import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { NetworkFrame } from 'semiotic';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { scaleLinear } from 'd3-scale';

const customTooltipContent = d => (
  <Card
    style={{
      position: 'relative',
      left: '10px',
      bottom: '-10px',
      zIndex: 999999,
    }}
    raised
  >
    <CardContent>
      <Typography variant="subtitle2">{d.fullName}</Typography>
      <Typography variant="subtitle2">Coautorias: {d.degree}</Typography>
    </CardContent>
  </Card>
);

class Graph extends PureComponent {
  render() {
    const { data, colorHash } = this.props;
    // Remove the automatically included field __typename
    // to avoid semiotic error
    const nodes = data.nodes.map(({
      _id, fullName, campus, selected,
    }) => ({
      _id, fullName, campus, selected,
    }));

    const weightExtremes = data.edges
      .reduce(({ min, max }, { weight }) => ({
        min: (weight < min) ? weight : min,
        max: (weight > max) ? weight : max,
      }), { min: 999999, max: 0 });

    const edgeScale = scaleLinear()
      .domain([weightExtremes.min, weightExtremes.max])
      .range([1, 10]);

    const nodeScale = scaleLinear()
      .domain([0, weightExtremes.max * 2])
      .range([2, 10]);

    const nodeStyle = colorHash.size > 1 ?
      d => ({ fill: colorHash.get(d.campus) }) : { fill: 'darkblue' };

    const iterationScale = scaleLinear()
      .domain([1, 800])
      .range([500, 40]);

    const iterations = Math.round(iterationScale(nodes.length));

    return (
      <NetworkFrame
        size={[900, 600]}
        edges={data.edges}
        nodes={nodes}
        edgeStyle={() => ({
          stroke: '#32c4c4', fill: '#32c4c4', fillOpacity: 0.25, strokeWidth: '1px',
        })}
        nodeStyle={nodeStyle}
        networkType={{ type: 'force', iterations, edgeStrength: 0.1 }}
        edgeType="ribbon"
        nodeIDAccessor="_id"
        nodeSizeAccessor={d => nodeScale(d.degree)}
        edgeWidthAccessor={d => edgeScale(d.weight)}
        hoverAnnotation
        tooltipContent={customTooltipContent}
        legend={colorHash.size > 1 ? {
          title: 'Campus',
          legendGroups: [
            {
              styleFn: d => ({ fill: d.color, stroke: 'black' }),
              items: [...colorHash]
                .reverse()
                .map(([label, color]) => ({ label, color })),
            },
          ],
        } : undefined}
      />
    );
  }
}

Graph.propTypes = {
  data: PropTypes.shape({
    nodes: PropTypes.array,
    edges: PropTypes.array.isRequired,
  }).isRequired,
  colorHash: PropTypes.instanceOf(Map),
};

Graph.defaultProps = {
  colorHash: new Map(),
};

export default Graph;
