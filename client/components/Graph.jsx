import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { NetworkFrame } from 'semiotic';
import { scaleLinear } from 'd3-scale';

import colors from '../utils/colors';
import CustomTooltip from './CustomTooltip';

class Graph extends PureComponent {
  render() {
    const { data } = this.props;
    // Remove the automatically included field __typename
    // to avoid semiotic error
    const nodes = data.nodes.map(({
      _id, fullName, group, selected,
    }) => ({
      _id, fullName, group, selected,
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
          stroke: colors.edge.stroke,
          fill: colors.edge.fill,
          fillOpacity: 0.25,
          strokeWidth: '1px',
        })}
        nodeStyle={{ fill: colors.node.fill }}
        networkType={{ type: 'force', iterations, edgeStrength: 0.1 }}
        edgeType="ribbon"
        nodeIDAccessor="_id"
        nodeSizeAccessor={d => nodeScale(d.degree)}
        edgeWidthAccessor={d => edgeScale(d.weight)}
        hoverAnnotation
        tooltipContent={d => (
          <CustomTooltip
            left={10}
            bottom={-10}
            minWidth={150}
            title1={d.fullName}
            title2={`Coautorias: ${d.degree}`}
          />
        )}
      />
    );
  }
}

Graph.propTypes = {
  data: PropTypes.shape({
    nodes: PropTypes.array,
    edges: PropTypes.array.isRequired,
  }).isRequired,
};

export default Graph;
